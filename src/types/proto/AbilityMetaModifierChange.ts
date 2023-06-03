import { ModifierActionEnum } from "./enum"

import { AbilityAttachedModifier, AbilityString, ModifierProperty } from "."

export interface AbilityMetaModifierChange {
  action: ModifierActionEnum
  parentAbilityName: AbilityString
  parentAbilityOverride: AbilityString
  attachedInstancedModifier: AbilityAttachedModifier
  properties: ModifierProperty[]
  modifierLocalId: number
  isMuteRemote: boolean
  applyEntityId: number
  isAttachedParentAbility: boolean
  serverBuffUid: number
}
