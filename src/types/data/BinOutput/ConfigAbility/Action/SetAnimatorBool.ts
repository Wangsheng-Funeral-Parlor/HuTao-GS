import { Action } from '.'
import PredicateConfig from '../Predicate'

export default interface SetAnimatorBool extends Action {
  Predicates?: PredicateConfig[]
  BoolID: string
  Value?: boolean
}