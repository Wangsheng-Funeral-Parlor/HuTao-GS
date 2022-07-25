import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PlayerLocationInfo, PlayerWorldLocationInfo } from '@/types/proto'

export interface WorldPlayerLocationNotify {
  playerLocList?: PlayerLocationInfo[]
  playerWorldLocList: PlayerWorldLocationInfo[]
}

class WorldPlayerLocationPacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldPlayerLocation')
  }

  async sendNotify(context: PacketContext, data: WorldPlayerLocationNotify): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.IN_GAME, true)) return

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: WorldPlayerLocationNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: WorldPlayerLocationPacket
export default (() => packet = packet || new WorldPlayerLocationPacket())()