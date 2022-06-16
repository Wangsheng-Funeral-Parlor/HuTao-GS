import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { PlayerRTTInfo } from '@/types/game/world'

export interface WorldPlayerRTTNotify {
  playerRttList: PlayerRTTInfo[]
}

class WorldPlayerRTTPacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldPlayerRTT')
  }

  async sendNotify(context: PacketContext, data: WorldPlayerRTTNotify): Promise<void> {
    if (!this.checkState(context, ClientState.IN_GAME, true)) return

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: WorldPlayerRTTNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: WorldPlayerRTTPacket
export default (() => packet = packet || new WorldPlayerRTTPacket())()