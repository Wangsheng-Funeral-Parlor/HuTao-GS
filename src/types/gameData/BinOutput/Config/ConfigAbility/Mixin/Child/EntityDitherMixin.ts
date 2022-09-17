import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface EntityDitherMixin extends ConfigBaseAbilityMixin {
  $type: 'EntityDitherMixin'
  Predicates: ConfigAbilityPredicate[]
  DitherValue: number
  CutInTime: number
  CutOutTime: number
}