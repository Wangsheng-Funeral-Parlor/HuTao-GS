import { AbilityScalarValueEntry, AbilityString } from "."

export interface AbilityAppliedAbility {
  abilityName?: AbilityString
  abilityOverride?: AbilityString
  overrideMap?: AbilityScalarValueEntry[]
  instancedAbilityId?: number
}
