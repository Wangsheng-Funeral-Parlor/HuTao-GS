import ElementBatchPredicated from '$DT/BinOutput/Config/ElementBatchPredicated'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface ElementHittingOtherPredicatedMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementHittingOtherPredicatedMixin'
  PrePredicates: ConfigAbilityPredicate[]
  ElementBatchPredicateds: ElementBatchPredicated[]
}