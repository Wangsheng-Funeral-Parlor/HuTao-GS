import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface ModifyAvatarSkillCD extends ConfigBaseAbilityAction {
  $type: 'ModifyAvatarSkillCD'
  SkillID: number
  SkillSlot: number[]
  CdDelta: DynamicFloat
  CdRatio: DynamicFloat
}