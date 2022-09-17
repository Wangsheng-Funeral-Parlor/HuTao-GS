import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'
import ConfigAbilityPredicate from '../../Predicate'

export default interface DoActionByAnimatorStateIDMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByAnimatorStateIDMixin'
  StateIDs: string[]
  EnterPredicates: ConfigAbilityPredicate[]
  ExitPredicates: ConfigAbilityPredicate[]
  EnterActions: ConfigAbilityAction[]
  ExitActions: ConfigAbilityAction[]
}