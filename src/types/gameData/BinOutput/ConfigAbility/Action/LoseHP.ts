import { Action } from '.'
import { ActionParam } from '../../Common/ActionParam'

export default interface LoseHP extends Action {
  Amount?: ActionParam
  AmountByCasterMaxHPRatio?: ActionParam
  AmountByTargetMaxHPRatio?: ActionParam
  AmountByTargetCurrentHPRatio?: ActionParam
  AmountByCasterAttackRatio?: ActionParam
  Lethal?: boolean
  EnableInvincible?: boolean
  EnableLockHP?: boolean
  DisableWhenLoading?: boolean
}