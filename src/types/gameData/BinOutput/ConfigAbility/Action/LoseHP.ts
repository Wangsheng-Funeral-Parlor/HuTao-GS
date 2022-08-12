import { Action } from '.'
import { ActionParam } from '../../Common/ActionParam'
import PredicateConfig from '../Predicate'

export default interface LoseHP extends Action {
  Target?: string
  DoOffStage?: boolean
  Predicates?: PredicateConfig[]
  Amount?: ActionParam
  AmountByTargetMaxHPRatio?: ActionParam
  AmountByTargetCurrentHPRatio?: ActionParam
  AmountByCasterMaxHPRatio?: ActionParam
  AmountByCasterAttackRatio?: ActionParam
  Lethal?: boolean
  EnableInvincible?: boolean
  EnableLockHP?: boolean
  DisableWhenLoading?: boolean
}