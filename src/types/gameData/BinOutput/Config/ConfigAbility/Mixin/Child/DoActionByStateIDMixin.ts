import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'
import ConfigAbilityPredicate from '../../Predicate'

export default interface DoActionByStateIDMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByStateIDMixin'
  StateIDs: string[]
  EnterPredicates: ConfigAbilityPredicate[]
  ExitPredicates: ConfigAbilityPredicate[]
  EnterActions: ConfigAbilityAction[]
  ExitActions: ConfigAbilityAction[]
}