import { DynamicFloat, DynamicInt, DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigAbilityStateToActions from '../../ConfigAbilityStateToActions'
import ConfigAttackInfo from '../../ConfigAttackInfo'
import ConfigBornType from '../../ConfigBornType'
import ConfigCameraRadialBlur from '../../ConfigCameraRadialBlur'
import ConfigCollision from '../../ConfigCollision'
import ConfigTornadoZone from '../../ConfigTornadoZone'
import DvalinS01PathEffsInfo from '../../DvalinS01PathEffsInfo'
import ElementBatchPredicated from '../../ElementBatchPredicated'
import ElementTypeModifier from '../../ElementTypeModifier'
import TileShapeInfo from '../../TileShapeInfo'
import ConfigAbilityAction from '../Action'
import ConfigAbilityPredicate from '../Predicate'

export default interface ConfigBaseAbilityMixin {
  IsUnique?: boolean
}

export interface AirFlowMixin extends ConfigBaseAbilityMixin {
  $type: 'AirFlowMixin'
  GadgetID: number
  CampID: number
  CampTargetType: string
  Born: ConfigBornType
}

export interface AnimatorRotationCompensateMixin extends ConfigBaseAbilityMixin {
  $type: 'AnimatorRotationCompensateMixin'
  AnimatorStateIDs: string[]
  AnimationRotate: number
  AngleLimit: number
}

export interface ApplyInertiaVelocityMixin extends ConfigBaseAbilityMixin {
  $type: 'ApplyInertiaVelocityMixin'
  Damping: number
  UseXZ: boolean
  UseY: boolean
}

export interface ApplyModifierWithSharedDurabilityMixin extends ConfigBaseAbilityMixin {
  $type: 'ApplyModifierWithSharedDurabilityMixin'
  ModifierName: string
}

export interface AttachModifierByStackingMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierByStackingMixin'
  ActionQueue: ConfigAbilityAction[]
  StackingModifier: string
}

export interface AttachModifierToElementDurabilityMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToElementDurabilityMixin'
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
}

export interface AttachModifierToHPPercentMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToHPPercentMixin'
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
}

export interface AttachModifierToPredicateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToPredicateMixin'
  Type: string
  OnEvent: string
  Predicates: ConfigAbilityPredicate[]
  ModifierName: string
  OnAbilityStateAdded: ConfigAbilityStateToActions[]
  OnAbilityStateRemoved: ConfigAbilityStateToActions[]
}

export interface AttachModifierToSelfGlobalValueMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToSelfGlobalValueMixin'
  GlobalValueTarget: string
  GlobalValueKey: string
  AddAction: string
  DefaultGlobalValueOnCreate: DynamicFloat
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
  ActionQueues: ConfigAbilityAction[][]
  RemoveAppliedModifier: boolean
}

export interface AttachModifierToTargetDistanceMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToTargetDistanceMixin'
  TargetIDs: number[]
  Byserver: boolean
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
  RemoveAppliedModifier: boolean
  BlendParam: string
  BlendDistance: DynamicFloat[]
  EffectPattern: string
}

export interface AttachToAbilityStateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToAbilityStateMixin'
  AbilityStates: string[]
  Reject: boolean
  ModifierName: string
}

export interface AttachToAIAlertnessMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToAIAlertnessMixin'
  Alertness: number[]
  ModifierName: string
}

export interface AttachToAnimatorStateIDMixin extends Omit<AttachToStateIDMixin, '$type'> {
  $type: 'AttachToAnimatorStateIDMixin'
}

export interface AttachToDayNightMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToDayNightMixin'
  Time: string
  ModifierName: string
}

export interface AttachToElementTypeMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToElementTypeMixin'
  ElementTypes: string[]
  Reject: boolean
  ModifierName: string
}

export interface AttachToGadgetStateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToGadgetStateMixin'
  GadgetState: number
  ModifierName: string
}

export interface AttachToGadgetStateMutexMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToGadgetStateMutexMixin'
  GadgetStates: number[]
  ModifierNames: string[]
}

export interface AttachToMonsterAirStateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToMonsterAirStateMixin'
  ModifierName: string
  IsAirMove: boolean
}

export interface AttachToNormalizedTimeMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToNormalizedTimeMixin'
  StateID: string
  ModifierName: string
  Target: string
  Predicates: ConfigAbilityPredicate[]
  NormalizeStart: number
  NormalizeEnd: number
}

export interface AttachToPlayStageMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToPlayStageMixin'
  Stage: number
  Actions: ConfigAbilityAction[]
}

export interface AttachToPoseIDMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToPoseIDMixin'
  PoseIDs: number[]
  ModifierName: string
}

export interface AttachToStateIDMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToStateIDMixin'
  StateIDs: string[]
  ModifierName: string
  Target: string
  Predicates: ConfigAbilityPredicate[]
  IsCheckOnAttach: boolean
}

export interface AttackCostElementMixin extends ConfigBaseAbilityMixin {
  $type: 'AttackCostElementMixin'
  StrikeType: string
  ElementType: string
  AttackType: string
  StrikeCostRatio: number
  AttackCostRatio: number
  ElementCostRatio: number
  CostElementType: string
  CostType: string
}

export interface AttackHittingSceneMixin extends ConfigBaseAbilityMixin {
  $type: 'AttackHittingSceneMixin'
  OnHittingScene: ConfigAbilityAction[]
  AnimEventIDs?: string[]
}

export interface AvatarChangeSkillMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarChangeSkillMixin'
  Index: number
  Priority: string
  AimSkillID: number
  JumpSkillID: number
  FlySkillID: number
  ChangeOnAdd: boolean
}

export interface AvatarLevelSkillMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarLevelSkillMixin'
  SkillID: number
  SkillIndex: number
}

export interface AvatarLockForwardFlyMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarLockForwardFlyMixin'
  WorldForward: DynamicVector
  FlySpeedScale: number
  FlyBackSpeedScale: number
  EularRawInput: DynamicVector
}

export interface AvatarSteerByCameraMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarSteerByCameraMixin'
  StateIDs: string[]
  AngularSpeed: number
}

export interface BanEntityMarkMixin extends ConfigBaseAbilityMixin {
  $type: 'BanEntityMarkMixin'
}

export interface BeingHitMixin extends ConfigBaseAbilityMixin {
  $type: 'BeingHitMixin'
  ToAttacker: ConfigAbilityAction[]
  ToAttackerOwner: ConfigAbilityAction[]
  ToAttackerOriginOwner: ConfigAbilityAction[]
}

export interface BillboardMarkMixin extends ConfigBaseAbilityMixin {
  $type: 'BillboardMarkMixin'
  IconName: string
  ShowDistance: number
}

export interface BoxClampWindZoneMixin extends ConfigBaseAbilityMixin {
  $type: 'BoxClampWindZoneMixin'
  Size: DynamicVector
  Born: ConfigBornType
  AttracForceStrength: number
  MaxStrengthRange: number
}

export interface ButtonHoldChargeMixin extends ConfigBaseAbilityMixin {
  $type: 'ButtonHoldChargeMixin'
  SkillID: number
  ChargeTime: number
  SecondChargeTime: DynamicFloat
  OnBeginUncharged: ConfigAbilityAction[]
  OnReleaseUncharged: ConfigAbilityAction[]
  OnBeginCharged: ConfigAbilityAction[]
  OnReleaseCharged: ConfigAbilityAction[]
  OnBeginSecondCharged: ConfigAbilityAction[]
  OnReleaseSecondCharged: ConfigAbilityAction[]
  ChargeStateIDs: string[]
}

export interface CameraBlurMixin extends ConfigBaseAbilityMixin {
  $type: 'CameraBlurMixin'
  CameraRadialBlur: ConfigCameraRadialBlur
}

export interface CameraLockMixin extends ConfigBaseAbilityMixin {
  $type: 'CameraLockMixin'
  TransName: string
  CfgPath: string
}

export interface ChangeFieldMixin extends ConfigBaseAbilityMixin {
  $type: 'ChangeFieldMixin'
  Type: string
  TargetRadius: number
  Time: number
}

export interface ChangePropTypeValueMixin extends ConfigBaseAbilityMixin {
  $type: 'ChangePropTypeValueMixin'
  PropType: string
  EnergyCostDelta: DynamicFloat
}

export interface ChargeBarMixin extends ConfigBaseAbilityMixin {
  $type: 'ChargeBarMixin'
  ChargeState: string | number
}

export interface CircleBarrageMixin extends ConfigBaseAbilityMixin {
  $type: 'CircleBarrageMixin'
  BulletID: number
  InnerRadius: number
  CutNum: number
  WaveNum: number
  WaveCD: number
  WavebulletNum: number
  Waveangle: number
  TriggerCD: number
  ShootPoint: string
}

export interface ClusterTriggerMixin extends ConfigBaseAbilityMixin {
  $type: 'ClusterTriggerMixin'
  Born: ConfigBornType
  ConfigID: number
  Radius: number
  Duration: number
  ValueSteps: DynamicFloat[]
  ActionQueue: ConfigAbilityAction[]
}

export interface CollisionMixin extends ConfigBaseAbilityMixin {
  $type: 'CollisionMixin'
  Collision: ConfigCollision
  MinShockSpeed: number
  Cd: number
  OnCollision: ConfigAbilityAction[]
}

export interface CostStaminaMixin extends ConfigBaseAbilityMixin {
  $type: 'CostStaminaMixin'
  CostStaminaDelta: DynamicFloat
  CostStaminaRatio: DynamicFloat
  OnStaminaEmpty: ConfigAbilityAction[]
}

export interface CurLocalAvatarMixin extends ConfigBaseAbilityMixin {
  $type: 'CurLocalAvatarMixin'
  ModifierName: string
}

export interface DebugMixin extends ConfigBaseAbilityMixin {
  $type: 'DebugMixin'
}

export interface DoActionByAnimatorStateIDMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByAnimatorStateIDMixin'
  StateIDs: string[]
  EnterPredicates: ConfigAbilityPredicate[]
  ExitPredicates: ConfigAbilityPredicate[]
  EnterActions: ConfigAbilityAction[]
  ExitActions: ConfigAbilityAction[]
}

export interface DoActionByCreateGadgetMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByCreateGadgetMixin'
  Type: string
  ActionQueue: ConfigAbilityAction[]
}

export interface DoActionByElementReactionMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByElementReactionMixin'
  Range: number
  EntityTypes: string[]
  EeactionTypes: string[]
  Actions: ConfigAbilityAction[]
}

export interface DoActionByEnergyChangeMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByEnergyChangeMixin'
  Type: string
  ElementTypes: string[]
  DoWhenEnergyMax: boolean
  OnGainEnergyByBall: ConfigAbilityAction[]
  OnGainEnergyByOther: ConfigAbilityAction[]
  OnGainEnergyByAll: ConfigAbilityAction[]
  OnGainEnergyMax: ConfigAbilityAction[]
}

export interface DoActionByEventMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByEventMixin'
  Type: string
  OnEvent: string
  PickItemConfigIDs: number[]
  Predicates: ConfigAbilityPredicate[]
  Actions: ConfigAbilityAction[]
  OnAbilityStateAdded: ConfigAbilityStateToActions[]
  OnAbilityStateRemoved: ConfigAbilityStateToActions[]
}

export interface DoActionByGainCrystalSeedMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByGainCrystalSeedMixin'
  ElementTypes: string[]
  Actions: ConfigAbilityAction[]
}

export interface DoActionByKillingMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByKillingMixin'
  AttackTags: string[]
  DetectWindow: number
  OnKill: ConfigAbilityAction[]
}

export interface DoActionByPoseIDMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByPoseIDMixin'
  PoseIDs: number[]
  EnterPredicates: ConfigAbilityPredicate[]
  ExitPredicates: ConfigAbilityPredicate[]
  EnterActions: ConfigAbilityAction[]
  ExitActions: ConfigAbilityAction[]
}

export interface DoActionByStateIDMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByStateIDMixin'
  StateIDs: string[]
  EnterPredicates: ConfigAbilityPredicate[]
  ExitPredicates: ConfigAbilityPredicate[]
  EnterActions: ConfigAbilityAction[]
  ExitActions: ConfigAbilityAction[]
}

export interface DoActionByTeamStatusMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByTeamStatusMixin'
  Actions: ConfigAbilityAction[]
  Predicates: ConfigAbilityPredicate[]
}

export interface DoReviveMixin extends ConfigBaseAbilityMixin {
  $type: 'DoReviveMixin'
  Type: string
  IgnoreDieAbyss: boolean
  IgnoreDieDrawn: boolean
  OnKillActions: ConfigAbilityAction[]
  OnReviveActions: ConfigAbilityAction[]
}

export interface DoTileActionManagerMixin extends ConfigBaseAbilityMixin {
  $type: 'DoTileActionManagerMixin'
  Duration: number
  ActionID: string
  ActionPosKey: string
  ActionRadiusKey: string
  Actions: ConfigAbilityAction[]
}

export interface DummyMixin extends ConfigBaseAbilityMixin {
  $type: 'DummyMixin'
  ActionList: ConfigAbilityAction[][]
}

export interface DvalinS01BoxMoxeMixin extends ConfigBaseAbilityMixin {
  $type: 'DvalinS01BoxMoxeMixin'
}

export interface DvalinS01PathEffsMixin extends ConfigBaseAbilityMixin {
  $type: 'DvalinS01PathEffsMixin'
  EffectStart: number
  EffectEnd: number
  EffInfos: DvalinS01PathEffsInfo[]
}

export interface ElementAdjustMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementAdjustMixin'
  ChangeInterval: number
  ElementModifies: { [elemType: string]: string }
}

export interface ElementHittingOtherPredicatedMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementHittingOtherPredicatedMixin'
  PrePredicates: ConfigAbilityPredicate[]
  ElementBatchPredicateds: ElementBatchPredicated[]
}

export interface ElementOuterGlowEffectMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementOuterGlowEffectMixin'
}

export interface ElementReactionShockMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementReactionShockMixin'
  ThinkInterval: number
  CampGlobalKey: string
  AttackAction: ConfigAbilityAction
  ConductAction: ConfigAbilityAction
}

export interface ElementShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementShieldMixin'
  ElementType: string
  ShowDamageText: string
  ShieldAngle: DynamicFloat
  ShieldHPRatio: DynamicFloat
  ShieldHP: DynamicFloat
  DamageRatio: DynamicFloat
  OnShieldBroken: ConfigAbilityAction[]
  OnShieldSuccess: ConfigAbilityAction[]
  OnShieldFailed: ConfigAbilityAction[]
  UseMutiPlayerFixData: boolean
}

export interface EliteShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'EliteShieldMixin'
  ShieldType: string
  ShieldAngle: DynamicFloat
  ShieldHPRatio: DynamicFloat
  ShieldHP: DynamicFloat
  CostShieldRatioName: string
  ShowDamageText: string
  OnShieldBroken: ConfigAbilityAction[]
  AmountByGetDamage: DynamicFloat
  TargetMuteHitEffect: boolean
  InfiniteShield: boolean
  HealLimitedByCasterMaxHPRatio: DynamicFloat
}

export interface EntityDefenceMixin extends ConfigBaseAbilityMixin {
  $type: 'EntityDefenceMixin'
  StateIDs: string[]
  DefendTriggerID: string
  DefendAngle: number
  DefendProbability: DynamicFloat
  DefendProbabilityDelta: DynamicFloat
  DefendTimeInterval: DynamicFloat
  AlwaysRecover: boolean
  DefendCountInterval: DynamicInt
}

export interface EntityDitherMixin extends ConfigBaseAbilityMixin {
  $type: 'EntityDitherMixin'
  Predicates: ConfigAbilityPredicate[]
  DitherValue: number
  CutInTime: number
  CutOutTime: number
}

export interface EntityInVisibleMixin extends ConfigBaseAbilityMixin {
  $type: 'EntityInVisibleMixin'
  Predicates: ConfigAbilityPredicate[]
  Reason: string
}

export interface EntityMarkShowTypeMixin extends ConfigBaseAbilityMixin {
  $type: 'EntityMarkShowTypeMixin'
  MarkType: string
}

export interface EnviroFollowRotateMixin extends ConfigBaseAbilityMixin {
  $type: 'EnviroFollowRotateMixin'
  SelfRotateOffSet: DynamicVector
  DeactiveOnCutsecneName: string
}

export interface ExtendLifetimeByPickedGadgetMixin extends ConfigBaseAbilityMixin {
  $type: 'ExtendLifetimeByPickedGadgetMixin'
  PickedConfigIDs: number[]
  ExtendLifeTime: DynamicFloat
  MaxExtendLifeTime: DynamicFloat
}

export interface FieldEntityCountChangeMixin extends ConfigBaseAbilityMixin {
  $type: 'FieldEntityCountChangeMixin'
  CampTargetType: string
  ForceTriggerWhenChangeAuthority: boolean
  TargetPredicates: ConfigAbilityPredicate[]
  OnFieldEnter: ConfigAbilityAction[]
  OnFieldExit: ConfigAbilityAction[]
}

export interface FixDvalinS04MoveMixin extends ConfigBaseAbilityMixin {
  $type: 'FixDvalinS04MoveMixin'
}

export interface GlobalMainShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'GlobalMainShieldMixin'
  ShieldType: string
  ShieldAngle: DynamicFloat
  ShieldHPRatio: DynamicFloat
  ShieldHP: DynamicFloat
  CostShieldRatioName: string
  ShowDamageText: string
  OnShieldBroken: ConfigAbilityAction[]
  AmountByGetDamage: DynamicFloat
  EffectPattern: string
  ChildShieldModifierName: string
  TargetMuteHitEffect: boolean
  InfiniteShield: boolean
  HealLimitedByCasterMaxHPRatio: DynamicFloat
  HealLimitedByLocalCreatureMaxHPRatio: DynamicFloat
}

export interface GlobalSubShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'GlobalSubShieldMixin'
  MainShieldModifierName: string
  NotifyMainshieldWhenHit: boolean
}

export interface HitLevelGaugeMixin extends ConfigBaseAbilityMixin {
  $type: 'HitLevelGaugeMixin'
  FromHitLevel: string
  ToHitLevel: string
  MaxCharge: number
  MinChargeDelta: number
  MaxChargeDelta: number
  FadeTime: number
}

export interface HomeworldEnterEditorMixin extends ConfigBaseAbilityMixin {
  $type: 'HomeworldEnterEditorMixin'
  EditorModifierNames: string[]
  WorldModifierNames: string[]
}

export interface IceFloorMixin extends ConfigBaseAbilityMixin {
  $type: 'IceFloorMixin'
  Width: number
  Height: number
  MoveDistance: number
  MinInterval: number
  DoAction: ConfigAbilityAction
}

export interface ModifyDamageMixin extends ConfigBaseAbilityMixin {
  $type: 'ModifyDamageMixin'
  AnimEventNames: string[]
  AttackTags: string[]
  AttackType: string
  IgnoreEventInfo: boolean
  DamagePercentage: DynamicFloat
  DamagePercentageRatio: DynamicFloat
  DamageExtra: DynamicFloat
  BonusCritical: DynamicFloat
  BonusCriticalHurt: DynamicFloat
  ElementTypeModifier: ElementTypeModifier
  Predicates: ConfigAbilityPredicate[]
  TrueDamage: boolean
}

export interface ModifyElementDecrateMixin extends ConfigBaseAbilityMixin {
  $type: 'ModifyElementDecrateMixin'
  Group: string
}

export interface ModifySkillCDByModifierCountMixin extends ConfigBaseAbilityMixin {
  $type: 'ModifySkillCDByModifierCountMixin'
  TargetType: string
  ModifierName: string
  SkillID: number
  CdDelta: DynamicFloat
}

export interface MonsterReadyMixin extends ConfigBaseAbilityMixin {
  $type: 'MonsterReadyMixin'
  OnMonsterReady: ConfigAbilityAction[]
}

export interface MoveStateMixin extends ConfigBaseAbilityMixin {
  $type: 'MoveStateMixin'
  Type: string
}

export interface OnAvatarUseSkillMixin extends ConfigBaseAbilityMixin {
  $type: 'OnAvatarUseSkillMixin'
  OnTriggerNormalAttack: ConfigAbilityAction[]
  OnTriggerSkill: ConfigAbilityAction[]
  OnTriggerUltimateSkill: ConfigAbilityAction[]
}

export interface OverrideAttackEventMixin extends ConfigBaseAbilityMixin {
  $type: 'OverrideAttackEventMixin'
  OverrideAttackEvent: string
}

export interface OverrideStickElemUIMixin extends ConfigBaseAbilityMixin {
  $type: 'OverrideStickElemUIMixin'
  EffName: string
}

export interface PlayerUidNotifyMixin extends ConfigBaseAbilityMixin {
  $type: 'PlayerUidNotifyMixin'
  OpParam: string
  OpType: number
  Logic: string
  Actions: ConfigAbilityAction[]
}

export interface RecycleModifierMixin extends ConfigBaseAbilityMixin {
  $type: 'RecycleModifierMixin'
  ModifierName: string
  Cd: number
  InitialCD: number
}

export interface RejectAttackMixin extends ConfigBaseAbilityMixin {
  $type: 'RejectAttackMixin'
  AttackTag: string
  LimitTime: number
  Type: string
}

export interface RelyOnElementMixin extends ConfigBaseAbilityMixin {
  $type: 'RelyOnElementMixin'
  ElementType: string
}

export interface ReplaceEventPatternMixin extends ConfigBaseAbilityMixin {
  $type: 'ReplaceEventPatternMixin'
  OldPatterns: string[]
  NewPatterns: string[]
}

export interface ResistClimateMixin extends ConfigBaseAbilityMixin {
  $type: 'ResistClimateMixin'
  ClimateTypes: string[]
  Source: string
  Trend: string
  Ratio: DynamicFloat
  Type: string
}

export interface ReviveElemEnergyMixin extends ConfigBaseAbilityMixin {
  $type: 'ReviveElemEnergyMixin'
  Type: string
  Period: DynamicFloat
  BaseEnergy: DynamicFloat
  Ratio: DynamicFloat
}

export interface ScenePropSyncMixin extends ConfigBaseAbilityMixin {
  $type: 'ScenePropSyncMixin'
}

export interface ServerCreateGadgetOnKillMixin extends ConfigBaseAbilityMixin {
  $type: 'ServerCreateGadgetOnKillMixin'
  GadgetIDList: number[]
  CampID: number
  CampTargetType: string
  RandomCreate: boolean
  UseOriginOwnerAsGadgetOwner: boolean
}

export interface ServerFinishWatcherMixin extends ConfigBaseAbilityMixin {
  $type: 'ServerFinishWatcherMixin'
  WatcherId: number
  Predicates: ConfigAbilityPredicate[]
}

export interface ServerUpdateGlobalValueMixin extends ConfigBaseAbilityMixin {
  $type: 'ServerUpdateGlobalValueMixin'
  Key: string
  UseLimitRange: boolean
  MaxValue: DynamicFloat
  MinValue: DynamicFloat
}

export interface SetSkillCanUseInStateMixin extends ConfigBaseAbilityMixin {
  $type: 'SetSkillCanUseInStateMixin'
  SkillList: number[]
  StateList: string[]
}

export interface ShaderLerpMixin extends ConfigBaseAbilityMixin {
  $type: 'ShaderLerpMixin'
  Type: string
}

export interface ShieldBarMixin extends ConfigBaseAbilityMixin {
  $type: 'ShieldBarMixin'
  OnShieldBroken: ConfigAbilityAction[]
  Revert: boolean
  ShowDamageText: string
  UseMutiPlayerFixData: boolean
}

export interface SkillButtonHoldChargeMixin extends ConfigBaseAbilityMixin {
  $type: 'SkillButtonHoldChargeMixin'
  AllowHoldLockDirection: boolean
  SkillID: number
  NextLoopTriggerID: string
  EndHoldTrigger: string
  BeforeStateIDs: string[]
  BeforeHoldDuration: number
  ChargeLoopStateIDs: string[]
  AfterStateIDs: string[]
  ChargeLoopDurations: number[]
  TransientStateIDs: string[]
}

export interface StageReadyMixin extends ConfigBaseAbilityMixin {
  $type: 'StageReadyMixin'
  OnStageReady: ConfigAbilityAction[]
}

export interface SteerAttackMixin extends ConfigBaseAbilityMixin {
  $type: 'SteerAttackMixin'
  SteerStateIDs: string[]
  StartNormalizedTime?: number
  EndNormalizedTime?: number
  AngularSpeed: number
  AttackAngle?: number
  AttackTrigger: string
  AttackDistance?: number
}

export interface SwitchSkillIDMixin extends ConfigBaseAbilityMixin {
  $type: 'SwitchSkillIDMixin'
  Priority: string
  SkillIndex: number
  SkillID: number
  FromSkillID: number
  ToSkillID: number
}

export interface TDPlayMixin extends ConfigBaseAbilityMixin {
  $type: 'TDPlayMixin'
  TowerType: string
  BaseCD: number
  BaseAttackRange: number
  OnFireActions: ConfigAbilityAction[]
  TowerModifierName: string
  BulletIDs: number[]
  Born: ConfigBornType
  PartRootNames: string[]
  TargetType: string
}

export interface TileAttackManagerMixin extends ConfigBaseAbilityMixin {
  $type: 'TileAttackManagerMixin'
  AttackID: string
  Interval: number
  AttackInfo: ConfigAttackInfo
}

export interface TileAttackMixin extends ConfigBaseAbilityMixin {
  $type: 'TileAttackMixin'
  AttackID: string
}

export interface TileComplexManagerMixin extends ConfigBaseAbilityMixin {
  $type: 'TileComplexManagerMixin'
  AttackID: string
  Interval: number
  SrcCamp: number
  AttackInfo: ConfigAttackInfo
}

export interface TileComplexMixin extends ConfigBaseAbilityMixin {
  $type: 'TileComplexMixin'
  AttackID: string
  AttachPointName: string
  Offset: DynamicVector
  Shape: TileShapeInfo
}

export interface TornadoMixin extends ConfigBaseAbilityMixin {
  $type: 'TornadoMixin'
  StageZone: ConfigTornadoZone[]
  Predicates: ConfigAbilityPredicate[]
  TargetType: string
  Born: ConfigBornType
  EnviroWindStrength: DynamicFloat
  EnviroWindRadius: DynamicFloat
}

export interface TriggerPostProcessEffectMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerPostProcessEffectMixin'
  PostEffectAssetName: string
  Duration: number
  IsStageEffect: boolean
}

export interface TriggerResistDamageTextMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerResistDamageTextMixin'
  ElementTypes: string[]
}

export interface TriggerTypeSupportMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerTypeSupportMixin'
  Duration: number
  Radius: number
}

export interface TriggerWeatherMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerWeatherMixin'
  Type: string
  AreaId: number
  WeatherPattern: string
  TransDuration: number
  Duration: number
}

export interface TriggerWitchTimeMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerWitchTimeMixin'
  IgnoreTargetType: string
  Timescale: number
  Duration: number
  UseMax: boolean
  EnableEffect: boolean
  EnableDelay: boolean
  DelayTimeScale: number
  DelayDuration: number
  OpenEffectPattern: string
  CloseEffectPattern: string
  WeatherPattern: string
}

export interface UrgentHotFixMixin extends ConfigBaseAbilityMixin {
  $type: 'UrgentHotFixMixin'
  LogicId: number
  ThinkInterval: number
  ActionList: ConfigAbilityAction[]
}

export interface VelocityDetectMixin extends ConfigBaseAbilityMixin {
  $type: 'VelocityDetectMixin'
  MinSpeed: number
  MaxSpeed: number
  DetectOnStart: boolean
  OnPoseedge: ConfigAbilityAction[]
  OnNegedge: ConfigAbilityAction[]
}

export interface VelocityForceMixin extends ConfigBaseAbilityMixin {
  $type: 'VelocityForceMixin'
  MuteAll: boolean
  UseAll: boolean
  IncludeForces: string[]
  ExcludeForces: string[]
}

export interface WatcherSystemMixin extends ConfigBaseAbilityMixin {
  $type: 'WatcherSystemMixin'
  WatcherId: number
  MixinType: string
  ListenEntityType: string
  ListenStateId: string
  Predicates: ConfigAbilityPredicate[]
}

export interface WeightDetectRegionMixin extends ConfigBaseAbilityMixin {
  $type: 'WeightDetectRegionMixin'
  GlobalValueKey: string
  OnWeightChanged: ConfigAbilityAction[]
}

export interface WindSeedSpawnerMixin extends ConfigBaseAbilityMixin {
  $type: 'WindSeedSpawnerMixin'
  RefreshEnable: boolean
  SpawnerRadius: number
  SpawnerHeightAngle: number
  SpawnerAreaAngle: number
  MinDistanceToAvatar: number
  MoveSuppressSpeed: number
  MoveRefreshAngleFreeze: number
  MoveRefreshAngleSlow: number
  MinNumPerSpawn: number
  MaxNumPerSpawn: number
  MaxSwapNumPerSpawn: number
  MinSeparateRange: number
  MaxSeparateRange: number
  RemoveSeedDistance: number
  RefreshMeterPerMeter: number
  RefreshMeterPerSecond: number
  RefreshMeterPerDistRemove: number
  RefreshMeterMax: number
  WindForceModifier: string
  WindExplodeModifier: string
  WindBulletAbility: string
  GlobalValueKey: string
  SpawnNumArray: number[]
  SeedGadgetID: number
  InitSignalStrength: number
  TriggerSignalStrength: number
  SignalDecaySpeed: number
  MutipleRange: number
  CatchSeedRange: number
}

export interface WindZoneMixin extends ConfigBaseAbilityMixin {
  $type: 'WindZoneMixin'
  ShapeName: string
  Born: ConfigBornType
  Strength: DynamicFloat
  Attenuation: DynamicFloat
  InnerRadius: DynamicFloat
  Reverse: boolean
  TargetType: string
  Predicates: ConfigAbilityPredicate[]
  ModifierName: string
  MaxNum: number
  ForceGrowth: number
  ForceFallen: number
}