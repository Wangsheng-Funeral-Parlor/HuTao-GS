import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface ServerFinishWatcherMixin extends ConfigBaseAbilityMixin {
  $type: 'ServerFinishWatcherMixin'
  WatcherId: number
  Predicates: ConfigAbilityPredicate[]
}