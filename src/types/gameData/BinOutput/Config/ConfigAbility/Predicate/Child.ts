import ConfigAttackPattern from "../../ConfigAttackPattern"

import ConfigAbilityPredicate from "."

import { DynamicFloat, DynamicInt, DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBaseAbilityPredicate {
  Target?: string
}

export interface ConfigBaseAbilityRelationalOperationPredicate extends ConfigBaseAbilityPredicate {
  Logic: string
}

export interface ByAnimatorBool extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByAnimatorBool"
  Value: boolean
  Parameter: string
}

export interface ByAnimatorFloat extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByAnimatorFloat"
  Value: DynamicFloat
  Parameter: string
}

export interface ByAnimatorInt extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByAnimatorInt"
  Value: DynamicInt
  Parameter: string
}

export interface ByAny extends ConfigBaseAbilityPredicate {
  $type: "ByAny"
  Predicates: ConfigAbilityPredicate[]
}

export interface ByAttackNotHitScene extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByAttackNotHitScene"
  AttackPattern: ConfigAttackPattern
  CheckWaterLayer: boolean
}

export interface ByAttackTags extends ConfigBaseAbilityPredicate {
  $type: "ByAttackTags"
  AttackTags: string[]
}

export interface ByAttackType extends ConfigBaseAbilityPredicate {
  $type: "ByAttackType"
  AttackType: string
}

export interface ByAvatarBodyType extends ConfigBaseAbilityPredicate {
  $type: "ByAvatarBodyType"
  BodyType: string
}

export interface ByAvatarElementType extends ConfigBaseAbilityPredicate {
  $type: "ByAvatarElementType"
  ElementType: string
}

export interface ByAvatarInWaterDepth extends ConfigBaseAbilityPredicate {
  $type: "ByAvatarInWaterDepth"
  CompareType: string
  Depth: number
}

export interface ByAvatarWeaponType extends ConfigBaseAbilityPredicate {
  $type: "ByAvatarWeaponType"
  WeaponTypes: string[]
}

export interface ByBigTeamBodyTypeSort extends ConfigBaseAbilityPredicate {
  $type: "ByBigTeamBodyTypeSort"
  Number: number
  Logic: string
}

export interface ByBigTeamElementTypeSort extends ConfigBaseAbilityPredicate {
  $type: "ByBigTeamElementTypeSort"
  Number: number
  Logic: string
}

export interface ByBigTeamHasBodyType extends ConfigBaseAbilityPredicate {
  $type: "ByBigTeamHasBodyType"
  BodyType: string
  Number: number
  Logic: string
}

export interface ByBigTeamHasElementType extends ConfigBaseAbilityPredicate {
  $type: "ByBigTeamHasElementType"
  ElementType: string
  Number: number
  Logic: string
}

export interface ByBigTeamHasFeatureTag extends ConfigBaseAbilityPredicate {
  $type: "ByBigTeamHasFeatureTag"
  FeatureTagID: number
  Number: number
  Logic: string
}

export interface ByBigTeamHasWeaponType extends ConfigBaseAbilityPredicate {
  $type: "ByBigTeamHasWeaponType"
  WeaponType: string
  Number: number
  Logic: string
}

export interface ByBigTeamWeaponTypeSort extends ConfigBaseAbilityPredicate {
  $type: "ByBigTeamWeaponTypeSort"
  Number: number
  Logic: string
}

export interface ByCompareWithTarget extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByCompareWithTarget"
  UseOwner: boolean
  Property: string
}

export interface ByConductive extends ConfigBaseAbilityPredicate {
  $type: "ByConductive"
}

export interface ByCurrentSceneId extends ConfigBaseAbilityPredicate {
  $type: "ByCurrentSceneId"
  SceneIds: number[]
}

export interface ByCurrentSceneTypes extends ConfigBaseAbilityPredicate {
  $type: "ByCurrentSceneTypes"
  SceneTypes: string[]
}

export interface ByCurTeamBodyTypeSort extends ConfigBaseAbilityPredicate {
  $type: "ByCurTeamBodyTypeSort"
  Number: number
  Logic: string
}

export interface ByCurTeamElementTypeSort extends ConfigBaseAbilityPredicate {
  $type: "ByCurTeamElementTypeSort"
  Number: number
  Logic: string
}

export interface ByCurTeamHasBodyType extends ConfigBaseAbilityPredicate {
  $type: "ByCurTeamHasBodyType"
  BodyType: string
  Number: number
  Logic: string
}

export interface ByCurTeamHasElementType extends ConfigBaseAbilityPredicate {
  $type: "ByCurTeamHasElementType"
  ElementType: string
  Number: number
  Logic: string
}

export interface ByCurTeamHasFeatureTag extends ConfigBaseAbilityPredicate {
  $type: "ByCurTeamHasFeatureTag"
  FeatureTagID: number
  Number: number
  Logic: string
}

export interface ByCurTeamHasWeaponType extends ConfigBaseAbilityPredicate {
  $type: "ByCurTeamHasWeaponType"
  WeaponType: string
  Number: number
  Logic: string
}

export interface ByCurTeamWeaponTypeSort extends ConfigBaseAbilityPredicate {
  $type: "ByCurTeamWeaponTypeSort"
  Number: number
  Logic: string
}

export interface ByDieStateFlag extends ConfigBaseAbilityPredicate {
  $type: "ByDieStateFlag"
  DieStateFlag: string
}

export interface ByElementReactionSourceType extends ConfigBaseAbilityPredicate {
  $type: "ByElementReactionSourceType"
  SourceType: string
}

export interface ByElementReactionType extends ConfigBaseAbilityPredicate {
  $type: "ByElementReactionType"
  ReactionType: string
}

export interface ByElementTriggerEntityType extends ConfigBaseAbilityPredicate {
  $type: "ByElementTriggerEntityType"
  EntityTypes: string[]
  ForcebyOriginOwner: boolean
}

export interface ByEnergyRatio extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByEnergyRatio"
  Ratio: DynamicFloat
}

export interface ByEntityAppearVisionType extends ConfigBaseAbilityPredicate {
  $type: "ByEntityAppearVisionType"
  VisionType: string
}

export interface ByEntityIsAlive extends ConfigBaseAbilityPredicate {
  $type: "ByEntityIsAlive"
}

export interface ByEntityTypes extends ConfigBaseAbilityPredicate {
  $type: "ByEntityTypes"
  EntityTypes: string[]
  Reject: boolean
  UseEventSource: boolean
  IsAuthority: number
}

export interface ByEquipAffixReady extends ConfigBaseAbilityPredicate {
  $type: "ByEquipAffixReady"
  EquipAffixDataID: number
}

export interface ByGameTimeIsLocked extends ConfigBaseAbilityPredicate {
  $type: "ByGameTimeIsLocked"
  IsLocked: boolean
}

export interface ByGlobalPosToGround extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByGlobalPosToGround"
  GlobalPos: string
  ToGroundHeight: DynamicFloat
  ToWater: boolean
}

export interface ByHasAbilityState extends ConfigBaseAbilityPredicate {
  $type: "ByHasAbilityState"
  AbilityState: string
}

export interface ByHasAttackTarget extends ConfigBaseAbilityPredicate {
  $type: "ByHasAttackTarget"
}

export interface ByHasChildGadget extends ConfigBaseAbilityPredicate {
  $type: "ByHasChildGadget"
  ConfigIdArray: number[]
  Value: number
  CompareType: string
  ForceByCaster: boolean
  CheckEntityAlive: boolean
}

export interface ByHasComponentTag extends ConfigBaseAbilityPredicate {
  $type: "ByHasComponentTag"
  Tags: string[]
}

export interface ByHasElement extends ConfigBaseAbilityPredicate {
  $type: "ByHasElement"
  Element: string
}

export interface ByHasFeatureTag extends ConfigBaseAbilityPredicate {
  $type: "ByHasFeatureTag"
  FeatureTagIDs: number[]
}

export interface ByHasShield extends ConfigBaseAbilityPredicate {
  $type: "ByHasShield"
  Type: string
  UsePotentShield: boolean
  PotentShieldType: string
}

export interface ByHasTag extends ConfigBaseAbilityPredicate {
  $type: "ByHasTag"
  Tag: string
}

export interface ByHitBoxName extends ConfigBaseAbilityPredicate {
  $type: "ByHitBoxName"
  HitBoxNames: string[]
}

export interface ByHitBoxType extends ConfigBaseAbilityPredicate {
  $type: "ByHitBoxType"
  HitBoxType: string
}

export interface ByHitCritical extends ConfigBaseAbilityPredicate {
  $type: "ByHitCritical"
}

export interface ByHitDamage extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByHitDamage"
  Damage: DynamicFloat
}

export interface ByHitElement extends ConfigBaseAbilityPredicate {
  $type: "ByHitElement"
  Element: string
}

export interface ByHitElementDurability extends ConfigBaseAbilityPredicate {
  $type: "ByHitElementDurability"
  Element: string
  Durability: number
  CompareType: string
  ApplyAttenuation: boolean
}

export interface ByHitEnBreak extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByHitEnBreak"
  EnBreak: DynamicFloat
}

export interface ByHitImpulse extends ConfigBaseAbilityPredicate {
  $type: "ByHitImpulse"
  HitImpulse: number
}

export interface ByHitStrikeType extends ConfigBaseAbilityPredicate {
  $type: "ByHitStrikeType"
  StrikeType: string | number
}

export interface ByIsCombat extends ConfigBaseAbilityPredicate {
  $type: "ByIsCombat"
}

export interface ByIsGadgetExistAround extends ConfigBaseAbilityPredicate {
  $type: "ByIsGadgetExistAround"
  GadgetIdArray: number[]
  TurnToTarget: boolean
}

export interface ByIsLocalAvatar extends ConfigBaseAbilityPredicate {
  $type: "ByIsLocalAvatar"
}

export interface ByIsMoveOnWater extends ConfigBaseAbilityPredicate {
  $type: "ByIsMoveOnWater"
}

export interface ByIsTargetCamp extends ConfigBaseAbilityPredicate {
  $type: "ByIsTargetCamp"
  CampBaseOn: string
  CampTargetType: string
}

export interface ByItemNumber extends ConfigBaseAbilityPredicate {
  $type: "ByItemNumber"
  ItemId: number
  ItemNum: number
}

export interface ByLocalAvatarStamina extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByLocalAvatarStamina"
  Stamina: DynamicFloat
}

export interface ByLocalAvatarStaminaRatio extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByLocalAvatarStaminaRatio"
  StaminaRatio: DynamicFloat
}

export interface ByMonsterAirState extends ConfigBaseAbilityPredicate {
  $type: "ByMonsterAirState"
  IsAirMove: boolean
}

export interface ByNot extends ConfigBaseAbilityPredicate {
  $type: "ByNot"
  Predicates: ConfigAbilityPredicate[]
}

export interface ByScenePropState extends ConfigBaseAbilityPredicate {
  $type: "ByScenePropState"
  EntityType: string
  State: string
}

export interface BySceneSurfaceType extends ConfigBaseAbilityPredicate {
  $type: "BySceneSurfaceType"
  Filters: string[]
  Include: boolean
  Offset: DynamicVector
}

export interface BySelfForwardAndTargetPosition extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "BySelfForwardAndTargetPosition"
  Value: DynamicFloat
  IsXZ: boolean
}

export interface BySkillReady extends ConfigBaseAbilityPredicate {
  $type: "BySkillReady"
  SkillID: number
  SkillSlot: number[]
}

export interface ByStageIsReadyTemp extends ConfigBaseAbilityPredicate {
  $type: "ByStageIsReadyTemp"
}

export interface BySummonTagValue extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "BySummonTagValue"
  SummonTag: number
  Value: DynamicInt
}

export interface ByTargetAltitude extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByTargetAltitude"
  Value: DynamicFloat
}

export interface ByTargetConfigID extends ConfigBaseAbilityPredicate {
  $type: "ByTargetConfigID"
  ConfigIdArray: number[]
}

export interface ByTargetElement extends ConfigBaseAbilityPredicate {
  $type: "ByTargetElement"
  ElementType: string
}

export interface ByTargetForwardAndSelfPosition extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByTargetForwardAndSelfPosition"
  Value: DynamicFloat
  IsXZ: boolean
}

export interface ByTargetGadgetState extends ConfigBaseAbilityPredicate {
  $type: "ByTargetGadgetState"
  GadgetState: number
}

export interface ByTargetGlobalValue extends ConfigBaseAbilityPredicate {
  $type: "ByTargetGlobalValue"
  Key: string
  Value: DynamicFloat
  MaxValue: DynamicFloat
  ForceByCaster: boolean
  CompareType?: string
}

export interface ByTargetHPRatio extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByTargetHPRatio"
  HPRatio: DynamicFloat
}

export interface ByTargetHPValue extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByTargetHPValue"
  HP: DynamicFloat
}

export interface ByTargetIsCaster extends ConfigBaseAbilityPredicate {
  $type: "ByTargetIsCaster"
  IsCaster: boolean
}

export interface ByTargetIsGhostToEnemy extends ConfigBaseAbilityPredicate {
  $type: "ByTargetIsGhostToEnemy"
}

export interface ByTargetIsSelf extends ConfigBaseAbilityPredicate {
  $type: "ByTargetIsSelf"
  IsSelf: boolean
}

export interface ByTargetLayoutArea extends ConfigBaseAbilityPredicate {
  $type: "ByTargetLayoutArea"
  AreaType: string
  ClimateType: string
  AreaID: number
}

export interface ByTargetOverrideMapValue extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByTargetOverrideMapValue"
  TargetAbilityName: string
  TargetKey: string
  TargetValue: DynamicFloat
}

export interface ByTargetPositionToSelfPosition extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByTargetPositionToSelfPosition"
  CompareType: string
  Value: DynamicFloat
}

export interface ByTargetRaycastVisiable extends ConfigBaseAbilityPredicate {
  $type: "ByTargetRaycastVisiable"
}

export interface ByTargetType extends ConfigBaseAbilityPredicate {
  $type: "ByTargetType"
  TargetType: string | number
  IsTarget: boolean
}

export interface ByTargetWeight extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: "ByTargetWeight"
  Weight: DynamicFloat
}

export interface ByUnlockTalentParam extends ConfigBaseAbilityPredicate {
  $type: "ByUnlockTalentParam"
  TalentParam: string
}

export interface ByWetHitCollider extends ConfigBaseAbilityPredicate {
  $type: "ByWetHitCollider"
}
