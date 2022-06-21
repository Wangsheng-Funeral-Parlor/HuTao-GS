import { AddressInfo } from 'net'
import { join } from 'path'
import { cwd } from 'process'
import { performance } from 'perf_hooks'
import * as dgram from 'dgram'
import EventEmitter from 'promise-events'
import { dataToPacket, dataToProtobuffer, objToProtobuffer, parsePacket, xorData } from '#/utils/dataUtils'
import handshake from '#/handshake'
import Client from '#/client'
import PacketHandler from '#/packetHandler'
import Logger from '@/logger'
import { cRGB } from '@/tty'
import Game from './game'
import { SocketContext, PacketHead } from '@/types/kcp'
import GlobalState from '@/globalState'
import { waitTick } from '@/utils/asyncWait'
import { ClientState } from '@/types/enum/state'
import { getCmdIdByName, getNameByCmdId, PACKET_HEAD } from './cmdIds'
import config from '@/config'
import { fileExists, readFile } from '@/utils/fileSystem'
import ec2b from './utils/ec2b'
import { PacketContext } from './packet'
import uidPrefix from './utils/uidPrefix'

export const verbosePackets = [
  'AbilityInvocationsNotify',
  'AvatarFightPropUpdateNotify',
  'ClientAbilityChangeNotify',
  'ClientAbilityInitFinishNotify',
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
  'ScenePlayerLocationNotify',
  'SceneTimeNotify',
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
    this.socket.bind(config.kcpPort, () => {
      logger.debug(`Listening on port ${cRGB(0xffffff, this.address().port.toString())}`)
      this.emit('listening')
    })

    this.loop = setInterval(this.update.bind(this), 1e3 / 60)
  }

  async stop(): Promise<void> {
    const { clients, loop } = this

    for (let clientID in clients) {
      await this.disconnect(clientID, 0)
    }

    clearInterval(loop)

    await waitTick()
    this.socket.close()
  }

  address(): AddressInfo {
    return this.socket.address()
  }

  async disconnect(clientID: string, reason: number = 5) {
    const { clients } = this
    const client = clients[clientID]

    if (!client) return false

    await client.destroy(reason)

    logger.info('Client disconnect:', clientID)
    delete clients[clientID]

    return true
  }

  async disconnectUid(uid: number, reason: number = 5) {
    const client = this.game.getPlayerByUid(uid)?.client
    if (!client) return false

    return this.disconnect(client.id, reason)
  }

  update() {
    performance.mark('Tick')

    const { frame, clients } = this
    const clientList = Object.values(clients)

    for (let i = frame; i < clientList.length; i += 2) {
      const client = clientList[i]
      if (!client.destroyed) client.update()
    }

    this.frame ^= 1

    performance.measure('Game tick', 'Tick')
  }

  private async handleMessage(data: Buffer, rinfo: dgram.RemoteInfo): Promise<void> {
    performance.mark('UDP')

    const { socket, clients, tokens } = this
    const { address, port } = rinfo
    const clientID: string = rinfo.address + '_' + rinfo.port + '_' + data.readUInt32LE(0).toString(16)
    const conv: number = data.readUInt32LE()
    const token: number = data.readUInt32LE(4)

    // Detect handshake
    if (data.length <= 20) {
      const ret = handshake(data)

      switch (ret.Magic1) {
        case 325: // 0x145 MAGIC_SEND_BACK_CONV
          tokens.push(ret.Token)
          break
        case 404: // 0x194 MAGIC_DISCONNECT
          this.disconnect(rinfo.address + '_' + rinfo.port + '_' + ret.Conv.toString(16), 0)
          break
      }

      socket.send(ret.buffer, 0, ret.buffer.length, port, address)
      performance.measure('UDP Handshake', 'UDP')

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
      client.state = ClientState.CONNECTION
    }

    client.inputKcp(data)

    while (await this.handleRecvKcp(client));

    performance.measure('UDP Message', 'UDP')
  }

  private async handleRecvKcp(client: Client): Promise<boolean> {
    let packet = client.recvKcp()
    if (!packet) return false

    // obtain initial key if needed
    if (!client.key) client.key = await this.getInitialKey(packet)

    // decrypt packet
    xorData(packet, client.key)

    // check if the recived data is a packet
    if (!this.isPacket(packet)) {
      logger.warn('Invalid packet:', packet)
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

    this.packetHandler.handle(packetID, packetName, data, context)
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
  }

  async sendProtobuf(client: Client, packetName: string, head: PacketHead, obj: object) {
    try {
      const packetHead = await objToProtobuffer(head, PACKET_HEAD, true)
      const packetData = await objToProtobuffer(obj, getCmdIdByName(packetName) as number)
      await this.send(client, packetName, packetHead as Buffer, packetData as Buffer, head.clientSequenceId)
    } catch (err) {
      logger.error('Error sending packet:', err)
    }
  }

  isPacket(packet: Buffer): boolean {
    return packet.length > 5 && packet.readInt16BE(0) === 0x4567 && packet.readUInt16BE(packet.byteLength - 2) === 0x89AB
  }

  async getInitialKey(packet: Buffer): Promise<Buffer> {
    let key = Buffer.alloc(4096)

    const binPath = join(cwd(), `data/bin/${config.version}/QueryCurrRegionHttpRsp.bin`)
    if (await fileExists(binPath)) {
      const QueryCurrRegionHttpRsp = await dataToProtobuffer(await readFile(binPath), 'QueryCurrRegionHttpRsp', true)
      key = ec2b(QueryCurrRegionHttpRsp.clientSecretKey)
    }

    const expected = (packet.readUInt16BE(0) ^ 0x4567) === key.readUInt16BE(0)
    logger.debug('Initial key match:', expected)

    return key
  }
}