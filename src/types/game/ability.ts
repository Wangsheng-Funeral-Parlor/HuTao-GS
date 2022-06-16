import { AbilityScalarTypeEnum } from '../enum/ability'

export interface AbilityAppliedAbility {
  abilityName: AbilityString
  abilityOverride: AbilityString
  overrideMap: AbilityScalarValueEntry[]
  instancedAbilityId: number
}

export interface AbilityAppliedModifier {
  modifierLocalId: number
  parentAbilityEntityId: number
  parentAbilityName: AbilityString
  parentAbilityOverride: AbilityString
  instancedAbilityId: number
  instancedModifierId: number
  existDuration: number
  attachedInstancedModifier: AbilityAttachedModifier
  applyEntityId: number
  isAttachedParentAbility: boolean
  modifierDurability: ModifierDurability
  sbuffUid: number
  isServerbuffModifier: boolean
}

export interface AbilityAttachedModifier {
  isInvalid: boolean
  ownerEntityId: number
  instancedModifierId: number
  isServerbuffModifier: boolean
  attachNameHash: number
}

export interface AbilityControlBlock {
  abilityEmbryoList: AbilityEmbryo[]
}

export interface AbilityEmbryo {
  abilityId: number
  abilityNameHash: number
  abilityOverrideNameHash: number
}

export interface AbilityMixinRecoverInfo {
  instancedAbilityId: number
  instancedModifierId: number

  localId: number
  dataList: number[]
  isServerbuffModifier: boolean
  massivePropList: MassivePropSyncInfo[]
}

export interface AbilityScalarValueEntry {
  floatValue?: number
  stringValue?: string
  intValue?: number
  uintValue?: number

  key: AbilityString
  valueType: AbilityScalarTypeEnum
}

export interface AbilityString {
  str?: string
  hash?: number
}

export interface AbilitySyncStateInfo {
  isInited?: boolean
  dynamicValueMap?: AbilityScalarValueEntry[]
  appliedAbilities?: AbilityAppliedAbility[]
  appliedModifiers?: AbilityAppliedModifier[]
  mixinRecoverInfos?: AbilityMixinRecoverInfo[]
  sgvDynamicValueMap?: AbilityScalarValueEntry[]
}

export interface MassivePropParam {
  type: number
  reactionInfoList: number[]
  paramList: number[]
  syncFlag: number
}

export interface MassivePropSyncInfo {
  id: number
  propList: MassivePropParam[]
}

export interface ModifierDurability {
  reduceRatio: number
  remainingDurability: number
}