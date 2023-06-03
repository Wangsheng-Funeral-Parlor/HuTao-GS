import ConfigBaseAbilityAction from ".."
import ConfigAbilityAction from "../.."

import ConfigAbilityPredicate from "$DT/BinOutput/Config/ConfigAbility/Predicate"

export default interface BaseUtilityAction extends ConfigBaseAbilityAction {}

export interface Predicated extends BaseUtilityAction {
  $type: "Predicated"
  TargetPredicates: ConfigAbilityPredicate[]
  SuccessActions: ConfigAbilityAction[]
  FailActions: ConfigAbilityAction[]
}
