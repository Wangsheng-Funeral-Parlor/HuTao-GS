import ConfigBaseAbilityAction from '.'
import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'

export default interface AvatarSkillStart extends ConfigBaseAbilityAction {
  $type: 'AvatarSkillStart'
  SkillID: number
  CdRatio?: DynamicFloat
  CostStaminaRatio?: DynamicFloat
}