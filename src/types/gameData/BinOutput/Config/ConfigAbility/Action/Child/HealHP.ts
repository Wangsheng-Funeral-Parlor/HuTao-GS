import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface HealHP extends ConfigBaseAbilityAction {
  $type: 'HealHP'
  Amount?: DynamicFloat
  AmountByCasterMaxHPRatio?: DynamicFloat
  AmountByTargetMaxHPRatio?: DynamicFloat
  AmountByTargetCurrentHPRatio?: DynamicFloat
  AmountByCasterAttackRatio?: DynamicFloat
  MuteHealEffect?: boolean
  HealRatio?: number
  IgnoreAbilityProperty?: boolean
}