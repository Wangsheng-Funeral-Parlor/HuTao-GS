import Packet, { PacketContext, PacketInterface } from '#/packet'
import Entity from '$/entity'
import { ClientStateEnum } from '@/types/enum'
import { PlayerDieTypeEnum } from '@/types/proto/enum'

export interface WorldPlayerDieNotify {
  monsterId?: number
  gadgetId?: number

  dieType: PlayerDieTypeEnum
  murdererEntityId: number
}

class WorldPlayerDiePacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldPlayerDie')
  }

  async sendNotify(context: PacketContext, targetEntity: Entity): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.IN_GAME, true)) return

    const { dieType, attackerId } = targetEntity

    const notifyData: WorldPlayerDieNotify = {
      dieType,
      murdererEntityId: attackerId
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: WorldPlayerDiePacket
export default (() => packet = packet || new WorldPlayerDiePacket())()