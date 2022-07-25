import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PlayerRTTInfo } from '@/types/proto'

export interface WorldPlayerRTTNotify {
  playerRttList: PlayerRTTInfo[]
}

class WorldPlayerRTTPacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldPlayerRTT')
  }

  async sendNotify(context: PacketContext, data: WorldPlayerRTTNotify): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.IN_GAME, true)) return

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: WorldPlayerRTTNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: WorldPlayerRTTPacket
export default (() => packet = packet || new WorldPlayerRTTPacket())()