import { Action } from '.'
import PredicateConfig from '../Predicate'

export default interface ApplyModifier extends Action {
  Predicates?: PredicateConfig[]
  Target?: string
  ModifierName: string
}