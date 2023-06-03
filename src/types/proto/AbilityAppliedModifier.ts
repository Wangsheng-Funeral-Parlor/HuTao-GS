import { AbilityAttachedModifier, AbilityString, ModifierDurability } from "."

export interface AbilityAppliedModifier {
  modifierLocalId?: number
  parentAbilityEntityId?: number
  parentAbilityName?: AbilityString
  parentAbilityOverride?: AbilityString
  instancedAbilityId?: number
  instancedModifierId?: number
  existDuration?: number
  attachedInstancedModifier?: AbilityAttachedModifier
  applyEntityId?: number
  isAttachedParentAbility?: boolean
  modifierDurability?: ModifierDurability
  sbuffUid?: number
  isServerbuffModifier?: boolean
}
