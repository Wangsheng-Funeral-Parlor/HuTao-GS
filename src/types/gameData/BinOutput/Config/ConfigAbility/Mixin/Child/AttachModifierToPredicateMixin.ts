import ConfigAbilityStateToActions from '$DT/BinOutput/Config/ConfigAbilityStateToActions'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface AttachModifierToPredicateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToPredicateMixin'
  Type: string
  OnEvent: string
  Predicates: ConfigAbilityPredicate[]
  ModifierName: string
  OnAbilityStateAdded: ConfigAbilityStateToActions[]
  OnAbilityStateRemoved: ConfigAbilityStateToActions[]
}