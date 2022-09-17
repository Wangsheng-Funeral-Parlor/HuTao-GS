import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface EntityInVisibleMixin extends ConfigBaseAbilityMixin {
  $type: 'EntityInVisibleMixin'
  Predicates: ConfigAbilityPredicate[]
  Reason: string
}