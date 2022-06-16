import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ChangeEnergyReasonEnum, ChangeHpReasonEnum, FightPropEnum, PropChangeReasonEnum } from '@/types/enum/fightProp'
import { ClientState } from '@/types/enum/state'

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
    await this.waitState(context, ClientState.IN_GAME, true)

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EntityFightPropChangeReasonNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EntityFightPropChangeReasonPacket
export default (() => packet = packet || new EntityFightPropChangeReasonPacket())()