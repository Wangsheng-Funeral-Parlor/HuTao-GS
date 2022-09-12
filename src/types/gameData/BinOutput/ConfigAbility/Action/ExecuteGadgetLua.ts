import { Action } from '.'
import PredicateConfig from '../Predicate'

export default interface ExecuteGadgetLua extends Action {
  Predicates?: PredicateConfig[]
  Param1?: number
  Param2?: number
  Param3?: number
}