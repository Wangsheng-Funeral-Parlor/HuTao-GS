import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ChangeEnergyReasonEnum } from '@/types/enum/fightProp'
import { ForwardTypeEnum } from '@/types/enum/invoke'
import { ClientState } from '@/types/enum/state'
import { VectorInterface } from '@/types/game/motion'

export interface EvtDoSkillSuccNotify {
  forwardType: ForwardTypeEnum
  casterId: number
  skillId: number
  forward: VectorInterface
}

class EvtDoSkillSuccPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtDoSkillSucc', {
      notifyState: ClientState.IN_GAME,
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