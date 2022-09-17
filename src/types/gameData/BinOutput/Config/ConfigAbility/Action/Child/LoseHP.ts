import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface LoseHP extends ConfigBaseAbilityAction {
  $type: 'LoseHP'
  Amount?: DynamicFloat
  AmountByCasterMaxHPRatio?: DynamicFloat
  AmountByTargetMaxHPRatio?: DynamicFloat
  AmountByTargetCurrentHPRatio?: DynamicFloat
  AmountByCasterAttackRatio?: DynamicFloat
  Lethal?: boolean
  EnableInvincible?: boolean
  EnableLockHP?: boolean
  DisableWhenLoading?: boolean
}