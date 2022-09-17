import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface WatcherSystemMixin extends ConfigBaseAbilityMixin {
  $type: 'WatcherSystemMixin'
  WatcherId: number
  MixinType: string
  ListenEntityType: string
  ListenStateId: string
  Predicates: ConfigAbilityPredicate[]
}