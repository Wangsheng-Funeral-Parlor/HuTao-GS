import ConfigBaseAbilityAction from '.'
import ConfigAbilityAction from '..'
import ConfigAbilityPredicate from '../../Predicate'

export default interface Predicated extends ConfigBaseAbilityAction {
  $type: 'Predicated'
  Target?: string
  TargetPredicates: ConfigAbilityPredicate[]
  SuccessActions: ConfigAbilityAction[]
  FailActions?: ConfigAbilityAction[]
}