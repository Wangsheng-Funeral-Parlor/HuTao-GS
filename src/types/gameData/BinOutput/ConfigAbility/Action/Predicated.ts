import ActionConfig, { Action } from '.'
import PredicateConfig from '../Predicate'

export default interface Predicated extends Action {
  Target?: string
  TargetPredicates: PredicateConfig[]
  SuccessActions: ActionConfig[]
  FailActions?: ActionConfig[]
}