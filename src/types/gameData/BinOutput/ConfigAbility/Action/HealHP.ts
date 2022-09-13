import { Action } from '.'
import { ActionParam } from '../../Common/ActionParam'

export default interface HealHP extends Action {
  Amount?: ActionParam
  AmountByCasterMaxHPRatio?: ActionParam
  AmountByTargetMaxHPRatio?: ActionParam
  AmountByTargetCurrentHPRatio?: ActionParam
  AmountByCasterAttackRatio?: ActionParam
  MuteHealEffect?: boolean
  HealRatio?: number
  IgnoreAbilityProperty?: boolean
}