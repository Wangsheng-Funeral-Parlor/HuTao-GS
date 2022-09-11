import BaseClass from '#/baseClass'
import Player from '$/player'
import config from '@/config'
import Logger from '@/logger'
import { ClientStateEnum } from '@/types/enum'
import { PacketHead } from '@/types/kcp'
import { ENetReasonEnum } from '@/types/proto/enum'
import MT19937 from '@/utils/mt19937'
import { versionStrToNum } from '@/utils/version'
import KcpServer from './'
import KcpWorkerInterface from './socket/worker/kcpWorker/kcpWorkerInterface'
import protoCleanup from './utils/protoCleanup'

const logger = new Logger('CLIENT', 0xffdb4a)

const noCleanupPackets = [
  'AvatarFightPropUpdateNotify',
  'EntityFightPropChangeReasonNotify',
  'EntityFightPropUpdateNotify',
  'PlayerPropNotify',
  'VehicleStaminaNotify'
]

export default class Client extends BaseClass {
  server: KcpServer

  conv: number
  workerId: number

  state: ClientStateEnum

  auid: string
  uid: number
  player: Player

  deadLink: boolean
  rtt: number

  readyToSave: boolean
  destroyed: boolean

  constructor(server: KcpServer, conv: number, workerId: number) {
    super()

    this.server = server

    this.conv = conv
    this.workerId = workerId

    this.state = ClientStateEnum.NONE

    this.auid = null
    this.uid = null
    this.player = null

    this.deadLink = false
    this.rtt = 0

    this.readyToSave = false
  }

  // Destroy client
  async destroy(_enetReason: ENetReasonEnum = ENetReasonEnum.ENET_SERVER_KICK) {
    const { server, player } = this

    this.destroyed = true

    if (player) await server.game.playerLogout(this)
    this.uid = null

    this.update()
  }

  // Update function
  update() {
    const { server, conv, player, state, deadLink } = this

    if (state > ClientStateEnum.DEADLINK && deadLink) {
      this.state = ClientStateEnum.DEADLINK
      server.disconnect(conv, ENetReasonEnum.ENET_TIMEOUT)
      return
    }

    this.emit('update')
    if (player) player.emit('Update')
  }

  // Generate xor key from seed
  async setKeyFromSeed(seed: bigint): Promise<void> {
    const { server, workerId } = this
    const { socket } = server
    const worker = socket.getWorker<KcpWorkerInterface>(workerId)
    if (!worker) return

    const doubleInit = versionStrToNum(config.version) >= 0x010500
    logger.debug('Seed:', seed, doubleInit)

    const mt = new MT19937()
    mt.seed(seed)

    if (doubleInit) {
      mt.seed(mt.int64())
      mt.int64()
    }

    const key = Buffer.alloc(4096)
    for (let i = 0; i < 4096; i += 8) key.writeBigUInt64BE(mt.int64(), i)

    await worker.setKey(key)
  }

  // Set client player uid
  setUid(auid: string, uid: number): void {
    logger.debug('Set UID:', uid)

    this.auid = auid
    this.uid = uid
  }

  // Send packet
  async sendPacket(packetName: string, packetHead: PacketHead, obj: object) {
    await this.server.socket.sendPacket(this.conv, packetName, packetHead, noCleanupPackets.includes(packetName) ? obj : protoCleanup(obj))
  }
}