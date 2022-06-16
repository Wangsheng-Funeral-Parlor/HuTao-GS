import { Action } from '.'
import PredicateConfig from '../Predicate'

export default interface DoWatcherSystemAction extends Action {
  Predicates: PredicateConfig[]
  WatcherId: number
  InThreatListOnly?: boolean
}