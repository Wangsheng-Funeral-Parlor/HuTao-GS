import { Action } from '.'
import { ActionParam } from '../../Common/ActionParam'
import PredicateConfig from '../Predicate'

export default interface HealHP extends Action {
  Target?: string
  DoOffStage?: boolean
  OtherTargets?: {
    $type: string
    ShapeName: string
    CampTargetType: string
    CampBasedOn?: string
    SizeRatio: number
  }
  Predicates?: PredicateConfig[]
  Amount?: ActionParam
  AmountByTargetMaxHPRatio?: ActionParam
  AmountByTargetCurrentHPRatio?: ActionParam
  AmountByCasterMaxHPRatio?: ActionParam
  AmountByCasterAttackRatio?: ActionParam
  MuteHealEffect?: boolean
}