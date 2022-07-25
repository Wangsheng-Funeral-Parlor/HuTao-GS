import BaseClass from '#/baseClass'
import { Kcp } from '#/utils/kcp'
import Player from '$/player'
import Logger from '@/logger'
import { ClientStateEnum } from '@/types/enum'
import { PacketHead, SocketContext } from '@/types/kcp'
import { ENetReasonEnum } from '@/types/proto/enum'
import MT19937 from '@/utils/mt19937'
import KcpServer from './'
import { Handshake } from './handshake'
import protoCleanup from './utils/protoCleanup'

const logger = new Logger('CLIENT', 0xffdb4a)

const noCleanupPackets = [
  "AvatarFightPropUpdateNotify",
  "EntityFightPropChangeReasonNotify",
  "EntityFightPropUpdateNotify"
]

export default class Client extends BaseClass {
  private conv: number
  private token: number

  private kcp: Kcp
  private ctx: SocketContext

  server: KcpServer

  id: string

  state: ClientStateEnum

  key: Buffer
  seqId: number
  auid: string
  uid: number
  player: Player

  readyToSave: boolean
  destroyed: boolean

  constructor(server: KcpServer, id: string, conv: number, token: number, ctx: SocketContext) {
    super()

    this.server = server

    this.id = id

    this.state = ClientStateEnum.NONE

    this.player = null
    this.key = null
    this.seqId = 0

    this.conv = conv
    this.token = token

    this.kcp = new Kcp(conv, token, this.outputKcp.bind(this))
    this.kcp.setNodelay(true, 0, false)
    this.kcp.setInterval(0)
    this.kcp.setMaxResend(1024)

    this.ctx = ctx

    this.readyToSave = false
  }

  get rtt() {
    return this.kcp.rtt
  }

  // Destroy client
  async destroy(enetReason: ENetReasonEnum = ENetReasonEnum.ENET_SERVER_KICK) {
    const { server, player, conv, token, ctx } = this
    const { address, port } = ctx

    this.destroyed = true

    if (player) await server.game.playerLogout(this)
    this.uid = null

    this.update()

    const handshake = new Handshake(Handshake.MAGIC_DISCONNECT, conv, token, enetReason)
    handshake.encode()

    server.socket.send(handshake.buffer, 0, handshake.buffer.length, port, address)
  }

  // Update function
  update() {
    const { server, kcp, player, state } = this

    if (state > ClientStateEnum.DEADLINK && kcp.isDeadLink()) {
      this.state = ClientStateEnum.DEADLINK
      server.disconnect(this.id)
    }

    this.updateKcp()

    this.emit('update')
    if (player) player.emit('Update')
  }

  // Decode received kcp packet
  inputKcp(buf: Buffer) {
    this.kcp.input(buf)
    this.updateKcp()
  }

  // Send kcp output to socket
  outputKcp(data: Buffer) {
    const { server, ctx } = this
    const { address, port } = ctx

    server.socket.send(data, 0, data.length, port, address)
  }

  // Send packet using kcp
  sendKcp(packet: Buffer) {
    this.kcp.send(packet)
  }

  // Read decoded kcp packet
  recvKcp() {
    const size = this.kcp.peekSize()
    if (size <= 0) return null

    const buf = Buffer.alloc(size)
    if (this.kcp.recv(buf) <= 0) return null

    return buf
  }

  // Update kcp
  updateKcp() {
    this.kcp.update(Date.now())
  }

  // Generate xor key from seed
  setKeyFromSeed(seed: bigint): void {
    logger.debug('Seed:', seed)

    const gen1 = new MT19937()
    const gen2 = new MT19937()
    gen1.seed(seed)
    gen2.seed(gen1.int64())
    gen2.int64()

    this.key = Buffer.alloc(4096)

    for (let i = 0; i < 4096; i += 8) {
      this.key.writeBigUInt64BE(gen2.int64(), i)
    }
  }

  // Set client player uid
  setUid(auid: string, uid: number): void {
    logger.debug('Set UID:', uid)

    this.auid = auid
    this.uid = uid
  }

  // Send raw packet
  async send(packetName: string, packetHead: Buffer, packetData: Buffer, seqId?: number) {
    await this.server.send(this, packetName, packetHead, packetData, seqId)
  }

  // Send protobuf packet
  async sendProtobuf(packetName: string, packetHead: PacketHead, obj: object) {
    await this.server.sendProtobuf(this, packetName, packetHead, noCleanupPackets.includes(packetName) ? obj : protoCleanup(obj))
  }
}