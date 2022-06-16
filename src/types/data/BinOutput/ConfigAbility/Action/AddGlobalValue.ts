import { Action } from '.'
import PredicateConfig from '../Predicate'

export default interface AddGlobalValue extends Action {
  Predicates?: PredicateConfig[]
  Value: number
  Key: string
  UseLimitRange?: boolean
  MaxValue: number
  MinValue: number
}