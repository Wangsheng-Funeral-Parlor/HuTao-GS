import { AbilityAppliedAbility, AbilityAppliedModifier, AbilityMixinRecoverInfo, AbilityScalarValueEntry } from "."

export interface AbilitySyncStateInfo {
  isInited?: boolean
  dynamicValueMap?: AbilityScalarValueEntry[]
  appliedAbilities?: AbilityAppliedAbility[]
  appliedModifiers?: AbilityAppliedModifier[]
  mixinRecoverInfos?: AbilityMixinRecoverInfo[]
  sgvDynamicValueMap?: AbilityScalarValueEntry[]
}
