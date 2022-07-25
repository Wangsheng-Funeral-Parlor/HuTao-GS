import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum, FightPropEnum } from '@/types/enum'
import { ChangeEnergyReasonEnum, ChangeHpReasonEnum, PropChangeReasonEnum } from '@/types/proto/enum'

export interface EntityFightPropChangeReasonNotify {
  entityId: number
  propType: FightPropEnum
  propDelta: number
  reason?: PropChangeReasonEnum
  paramList: number[]
  changeHpReason?: ChangeHpReasonEnum
  changeEnergyReason?: ChangeEnergyReasonEnum
}

class EntityFightPropChangeReasonPacket extends Packet implements PacketInterface {
  constructor() {
    super('EntityFightPropChangeReason')
  }

  async sendNotify(context: PacketContext, data: EntityFightPropChangeReasonNotify): Promise<void> {
    await this.waitState(context, ClientStateEnum.IN_GAME, true)

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EntityFightPropChangeReasonNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EntityFightPropChangeReasonPacket
export default (() => packet = packet || new EntityFightPropChangeReasonPacket())()