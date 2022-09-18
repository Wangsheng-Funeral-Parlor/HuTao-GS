import ConfigAbilityPredicate from '$DT/BinOutput/Config/ConfigAbility/Predicate'
import BaseUtilityAction from '.'
import ConfigAbilityAction from '../../..'

export default interface Predicated extends BaseUtilityAction {
  $type: 'Predicated'
  TargetPredicates: ConfigAbilityPredicate[]
  SuccessActions: ConfigAbilityAction[]
  FailActions: ConfigAbilityAction[]
}