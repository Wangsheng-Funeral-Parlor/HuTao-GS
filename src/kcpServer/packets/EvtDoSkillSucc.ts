import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { VectorInfo } from '@/types/proto'
import { ChangeEnergyReasonEnum, ForwardTypeEnum } from '@/types/proto/enum'

export interface EvtDoSkillSuccNotify {
  forwardType: ForwardTypeEnum
  casterId: number
  skillId: number
  forward: VectorInfo
}

class EvtDoSkillSuccPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtDoSkillSucc', {
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtDoSkillSuccNotify): Promise<void> {
    const { avatarList } = context.player
    const { casterId, skillId } = data

    const avatar = avatarList.find(a => a.entityId === casterId && a.skillDepot.energySkill?.id === skillId)
    if (!avatar) return

    await avatar.fightProps.drainEnergy(true, ChangeEnergyReasonEnum.CHANGE_ENERGY_SKILL_START)
  }
}

let packet: EvtDoSkillSuccPacket
export default (() => packet = packet || new EvtDoSkillSuccPacket())()