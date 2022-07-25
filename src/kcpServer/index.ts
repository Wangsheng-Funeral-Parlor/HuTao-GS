import Client from '#/client'
import handshake from '#/handshake'
import PacketHandler from '#/packetHandler'
import { dataToPacket, dataToProtobuffer, objToProtobuffer, parsePacket, xorData } from '#/utils/dataUtils'
import config from '@/config'
import GlobalState from '@/globalState'
import Logger from '@/logger'
import { cRGB } from '@/tty'
import { ClientStateEnum } from '@/types/enum'
import { PacketHead, SocketContext } from '@/types/kcp'
import { QueryCurrRegionHttpRsp } from '@/types/proto'
import { ENetReasonEnum } from '@/types/proto/enum'
import { waitTick } from '@/utils/asyncWait'
import DispatchKey from '@/utils/dispatchKey'
import { fileExists, readFile, writeFile } from '@/utils/fileSystem'
import { getEc2bKey } from '@/utils/mhyCrypto/ec2b'
import * as dgram from 'dgram'
import { AddressInfo } from 'net'
import { join } from 'path'
import { cwd } from 'process'
import EventEmitter from 'promise-events'
import { getCmdIdByName, getNameByCmdId, PACKET_HEAD } from './cmdIds'
import Game from './game'
import { PacketContext } from './packet'
import uidPrefix from './utils/uidPrefix'

const {
  version,
  packetsToDump,
  autoPatch,
  kcpPort
} = config

export const verbosePackets = [
  'AbilityInvocationsNotify',
  'AvatarFightPropUpdateNotify',
  'ClientAbilityChangeNotify',
  'ClientAbilityInitFinishNotify',
  'ClientReportNotify',
  'CombatInvocationsNotify',
  'EntityAiSyncNotify',
  'EntityConfigHashNotify',
  'EntityFightPropChangeReasonNotify',
  'EntityFightPropUpdateNotify',
  'EvtAiSyncCombatThreatInfoNotify',
  'EvtAiSyncSkillCdNotify',
  'EvtAvatarUpdateFocusNotify',
  'EvtDoSkillSuccNotify',
  'EvtEntityRenderersChangedNotify',
  'MonsterAIConfigHashNotify',
  'PingReq',
  'PingRsp',
  'QueryPathReq',
  'QueryPathRsp',
  'SceneAudioNotify',
  'SceneEntityMoveNotify',
  'ScenePlayerLocationNotify',
  'SceneTimeNotify',
  'SetEntityClientDataNotify',
  'UnionCmdNotify',
  'WorldPlayerLocationNotify',
  'WorldPlayerRTTNotify'
]

const logger = new Logger('KCPSRV', 0xc824ff)

export default class KcpServer extends EventEmitter {
  private loop: NodeJS.Timer
  private frame: number

  globalState: GlobalState
  socket: dgram.Socket
  game: Game
  packetHandler: PacketHandler
  clients: { [clientID: string]: Client }
  tokens: number[]

  constructor(globalState: GlobalState) {
    super()

    this.globalState = globalState

    this.socket = dgram.createSocket('udp4')

    this.game = new Game(this)
    this.packetHandler = new PacketHandler(this)

    this.clients = {}
    this.tokens = []

    this.frame = 0

    this.handleMessage = this.handleMessage.bind(this)
    this.handlePacket = this.handlePacket.bind(this)

    this.socket.on('message', this.handleMessage)
    this.socket.on('error', err => logger.error('Socket error:', err))
  }

  start(): void {
    this.socket.bind(kcpPort, () => {
      logger.debug(`Listening on port ${cRGB(0xffffff, this.address().port.toString())}`)
      this.emit('listening')
    })

    this.loop = setInterval(this.update.bind(this), 1e3 / 60)
  }

  async stop(): Promise<void> {
    const { clients, loop } = this

    for (let clientID in clients) {
      await this.disconnect(clientID, ENetReasonEnum.ENET_SERVER_SHUTDOWN)
    }

    clearInterval(loop)

    await waitTick()
    this.socket.close()
  }

  address(): AddressInfo {
    return this.socket.address()
  }

  async disconnect(clientID: string, enetReason: ENetReasonEnum = ENetReasonEnum.ENET_SERVER_KICK) {
    const { clients } = this
    const client = clients[clientID]

    if (!client) return false

    await client.destroy(enetReason)

    logger.info('Client disconnect:', clientID, 'Reason:', ENetReasonEnum[enetReason] || enetReason)
    delete clients[clientID]

    return true
  }

  async disconnectUid(uid: number, enetReason: ENetReasonEnum = ENetReasonEnum.ENET_SERVER_KICK) {
    const client = this.game.getPlayerByUid(uid)?.client
    if (!client) return false

    return this.disconnect(client.id, enetReason)
  }

  update() {
    Logger.mark('Tick')

    const { frame, clients } = this
    const clientList = Object.values(clients)

    for (let i = frame; i < clientList.length; i += 2) {
      const client = clientList[i]
      if (!client.destroyed) client.update()
    }

    this.frame ^= 1

    Logger.measure('Game tick', 'Tick')
  }

  private async dump(name: string, data: Buffer) {
    if (!this.globalState.get('PacketDump')) return

    try {
      const dumpPath = join(cwd(), 'data/log/dump', `${name}.bin`)
      if (data.length <= 0 || (await fileExists(dumpPath) && (await readFile(dumpPath)).length >= data.length)) return
      await writeFile(dumpPath, data)
    } catch (err) { }
  }

  private async handleMessage(data: Buffer, rinfo: dgram.RemoteInfo): Promise<void> {
    Logger.mark('UDP')

    const { socket, clients, tokens } = this
    const { address, port } = rinfo
    const clientID: string = rinfo.address + '_' + rinfo.port + '_' + data.readUInt32LE(0).toString(16)
    const conv: number = data.readUInt32LE()
    const token: number = data.readUInt32LE(4)

    // Detect handshake
    if (data.length <= 20) {
      const hs = handshake(data)

      switch (hs.Magic1) {
        case 325: // 0x145 MAGIC_SEND_BACK_CONV
          tokens.push(hs.Token)
          socket.send(hs.buffer, 0, hs.buffer.length, port, address)
          break
        case 404: // 0x194 MAGIC_DISCONNECT
          await this.disconnect(rinfo.address + '_' + rinfo.port + '_' + hs.Conv.toString(16), hs.Data)
          break
      }

      Logger.measure('UDP Handshake', 'UDP')
      return
    }

    let client: Client = clients[clientID]

    if (!client) {
      const tokenIndex = tokens.indexOf(token)

      // Forgot handshake?
      if (tokenIndex === -1) return

      tokens.splice(tokenIndex, 1)
      logger.info(`Client connect: ${clientID}`)

      const ctx: SocketContext = {
        address,
        port,
        clientID: clientID
      }

      client = clients[clientID] = new Client(this, clientID, conv, token, ctx)

      // Set client state
      client.state = ClientStateEnum.CONNECTION
    }

    client.inputKcp(data)

    while (await this.handleRecvKcp(client));

    Logger.measure('UDP Message', 'UDP')
  }

  private async handleRecvKcp(client: Client): Promise<boolean> {
    let packet = client.recvKcp()
    if (!packet) return false

    // obtain initial key if needed
    if (!client.key) client.key = await this.getDispatchKey(packet)

    // decrypt packet
    xorData(packet, client.key)

    // check if the recived data is a packet
    if (!this.isPacket(packet)) {
      logger.warn('Invalid packet received, xor decrypt failed?')
      await this.dump(`raw-${client.id}`, packet)
      return true
    }

    await this.handlePacket(packet, client)
    return true
  }

  private async handlePacket(packet: Buffer, client: Client): Promise<void> {
    const packetID: number = packet.readUInt16BE(2)
    const packetName: string = getNameByCmdId(packetID).toString()
    const { head, data } = parsePacket(packet)

    const packetHead = await dataToProtobuffer(head, PACKET_HEAD, true) as PacketHead
    const seqId = packetHead?.clientSequenceId || client.seqId

    client.seqId = seqId

    const context = new PacketContext(client, seqId)

    const log = [
      uidPrefix('RECV', client, 0x00d5ff),
      this.globalState.state.ShowPacketId ? packetID : '-',
      cRGB(0xc5ff00, seqId?.toString()?.slice(-6)?.padStart(6, '0') || '------'),
      packetName
    ]

    if (verbosePackets.includes(packetName)) logger.verbose(...log)
    else logger.debug(...log)

    await this.packetHandler.handle(packetID, packetName, data, context)

    if (packetsToDump.includes(packetName)) await this.dump(`recv-${packetName}-S${seqId || 0}-T${Date.now()}`, data)
  }

  async send(client: Client, packetName: string, packetHead: Buffer, packetData?: Buffer, seqId?: number): Promise<void> {
    if (packetData == null) {
      logger.warn('No data to send:', packetName)
      return
    }

    packetName = packetName.replace(/\d*$/g, '')
    const packetID = parseInt(getCmdIdByName(packetName).toString())
    const packet = await dataToPacket(packetHead, packetData, packetID, client.key)

    const log = [
      uidPrefix('SEND', client, 0x7000ff),
      this.globalState.state.ShowPacketId ? packetID : '-',
      cRGB(0x00e5ff, seqId?.toString()?.slice(-6)?.padStart(6, '0') || '------'),
      packetName
    ]

    if (verbosePackets.includes(packetName)) logger.verbose(...log)
    else logger.debug(...log)

    client.sendKcp(packet)

    if (packetsToDump.includes(packetName)) await this.dump(`send-${packetName}-S${seqId || 0}-T${Date.now()}`, packetData)
  }

  async sendProtobuf(client: Client, packetName: string, head: PacketHead, obj: object) {
    try {
      const packetHead = await objToProtobuffer(head, PACKET_HEAD, true)
      const packetData = await objToProtobuffer(obj, getCmdIdByName(packetName) as number)
      await this.send(client, packetName, packetHead, packetData, head.clientSequenceId)
    } catch (err) {
      logger.error('Error sending packet:', err)
    }
  }

  isPacket(packet: Buffer): boolean {
    return packet.length > 5 && packet.readInt16BE(0) === 0x4567 && packet.readUInt16BE(packet.byteLength - 2) === 0x89AB
  }

  async getDispatchKey(packet: Buffer): Promise<Buffer> {
    let key = Buffer.alloc(4096)

    if (autoPatch) {
      const binPath = join(cwd(), `data/bin/${version}/QueryCurrRegionHttpRsp.bin`)
      if (await fileExists(binPath)) {
        const curRegionRsp: QueryCurrRegionHttpRsp = await dataToProtobuffer(await readFile(binPath), 'QueryCurrRegionHttpRsp', true)
        key = getEc2bKey(Buffer.from(curRegionRsp.clientSecretKey))
      }
    } else {
      key = await DispatchKey.getXorKey()
    }

    const expected = (packet.readUInt16BE(0) ^ 0x4567) === key.readUInt16BE(0)
    logger.debug('Initial key match:', expected)

    return key
  }
}