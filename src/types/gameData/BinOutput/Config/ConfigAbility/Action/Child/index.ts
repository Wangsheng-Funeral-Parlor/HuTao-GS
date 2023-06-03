import ConfigAbilityAction from ".."
import ConfigAbilityPredicate from "../../Predicate"

import CreateEntity from "./CreateEntity"
import UtilityAction from "./UtilityAction"

import { DynamicFloat, DynamicInt, DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"
import ConfigAttackEvent from "$DT/BinOutput/Config/ConfigAttackEvent"
import ConfigAttackInfo from "$DT/BinOutput/Config/ConfigAttackInfo"
import ConfigAttackTargetMapEvent from "$DT/BinOutput/Config/ConfigAttackTargetMapEvent"
import ConfigAudioOperation from "$DT/BinOutput/Config/ConfigAudioOperation"
import ConfigAvatarHitBucketSetting from "$DT/BinOutput/Config/ConfigAvatarHitBucketSetting"
import ConfigBornType from "$DT/BinOutput/Config/ConfigBornType"
import ConfigCameraRadialBlur from "$DT/BinOutput/Config/ConfigCameraRadialBlur"
import ConfigCameraShake from "$DT/BinOutput/Config/ConfigCameraShake"
import ConfigHitScene from "$DT/BinOutput/Config/ConfigHitScene"
import ConfigLightAttach from "$DT/BinOutput/Config/ConfigLightAttach"
import ConfigLightComponent from "$DT/BinOutput/Config/ConfigLightComponent"
import ConfigStateCameraParam from "$DT/BinOutput/Config/ConfigStateCameraParam"
import ConfigTimeSlow from "$DT/BinOutput/Config/ConfigTimeSlow"
import FocusAssistanceGroup from "$DT/BinOutput/Config/FocusAssistanceGroup"
import GlobalValuePair from "$DT/BinOutput/Config/GlobalValuePair"
import RocketJumpExt from "$DT/BinOutput/Config/RocketJumpExt"
import SelectTargets from "$DT/BinOutput/Config/SelectTargets"
import SelectTargetsByChildren from "$DT/BinOutput/Config/SelectTargets/Child/SelectTargetsByChildren"
import { GadgetStateEnum } from "@/types/enum"

export default interface ConfigBaseAbilityAction {
  Target?: string
  OtherTargets?: SelectTargets
  DoOffStage?: boolean
  DoAfterDie?: boolean
  CanBeHandledOnRecover?: boolean
  MuteRemoteAction?: boolean
  Predicates?: ConfigAbilityPredicate[]
  PredicatesForeach?: ConfigAbilityPredicate[]
}

export interface ActCameraRadialBlur extends ConfigBaseAbilityAction {
  $type: "ActCameraRadialBlur"
  CameraRadialBlur: ConfigCameraRadialBlur
}

export interface ActCameraShake extends ConfigBaseAbilityAction {
  $type: "ActCameraShake"
  CameraShake: ConfigCameraShake
  Born: ConfigBornType
}

export interface ActTimeSlow extends ConfigBaseAbilityAction {
  $type: "ActTimeSlow"
  TimeSlow: ConfigTimeSlow
  IsGlobal: boolean
}

export interface AddAvatarSkillInfo extends ConfigBaseAbilityAction {
  $type: "AddAvatarSkillInfo"
  SkillID: number
}

export interface AddClimateMeter extends ConfigBaseAbilityAction {
  $type: "AddClimateMeter"
  ClimateType: string
  Value: DynamicFloat
}

export interface AddElementDurability extends ConfigBaseAbilityAction {
  $type: "AddElementDurability"
  Value: DynamicFloat
  ModifierName: string
  ElementType: string
  SortModifier: string
  UseLimitRange: boolean
  MaxValue: DynamicFloat
  MinValue: DynamicFloat
}

export interface AddGlobalPos extends ConfigBaseAbilityAction {
  $type: "AddGlobalPos"
  Key: string
  Born: ConfigBornType
  SetTarget: boolean
}

export interface AddGlobalValue extends ConfigBaseAbilityAction {
  $type: "AddGlobalValue"
  Value: number
  Key: string
  UseLimitRange?: boolean
  RandomInRange?: boolean
  MaxValue: number
  MinValue: number
}

export interface AddGlobalValueToTarget extends ConfigBaseAbilityAction {
  $type: "AddGlobalValueToTarget"
  SrcTarget: string
  DstTarget: string
  SrcKey: string
  DstKey: string
}

export interface AddServerBuff extends ConfigBaseAbilityAction {
  $type: "AddServerBuff"
  SBuffId: number
  Time: number
}

export interface ApplyLevelModifier extends ConfigBaseAbilityAction {
  $type: "ApplyLevelModifier"
  ModifierName: string
}

export interface ApplyModifier extends ConfigBaseAbilityAction {
  $type: "ApplyModifier"
  ModifierName: string
}

export interface AttachAbilityStateResistance extends ConfigBaseAbilityAction {
  $type: "AttachAbilityStateResistance"
  ResistanceListID: number
  ResistanceBuffDebuffs: string[]
  DurationRatio: number
}

export interface AttachBulletAimPoint extends ConfigBaseAbilityAction {
  $type: "AttachBulletAimPoint"
  BulletAimPoint: string
}

export interface AttachEffect extends ConfigBaseAbilityAction {
  $type: "AttachEffect"
  EffectPattern: string
  Born?: ConfigBornType
  Scale?: number
  EffectTempleteID?: number
}

export interface AttachElementTypeResistance extends ConfigBaseAbilityAction {
  $type: "AttachElementTypeResistance"
  ElementType: string
  DurationRatio: number
}

export interface AttachLight extends ConfigBaseAbilityAction {
  $type: "AttachLight"
  Attach: ConfigLightAttach
  Light: ConfigLightComponent
}

export interface AttachModifier extends ConfigBaseAbilityAction {
  $type: "AttachModifier"
  ModifierName: string
}

export interface AvatarCameraParam extends ConfigBaseAbilityAction {
  $type: "AvatarCameraParam"
  CameraParam: ConfigStateCameraParam
}

export interface AvatarDoBlink extends ConfigBaseAbilityAction {
  $type: "AvatarDoBlink"
  PreferInput: boolean
  Distance: number
}

export interface AvatarEnterCameraShot extends ConfigBaseAbilityAction {
  $type: "AvatarEnterCameraShot"
  CameraMoveCfgPath: string
  ShotType: string
}

export interface AvatarEnterFocus extends ConfigBaseAbilityAction {
  $type: "AvatarEnterFocus"
  CameraFollowLower: DynamicVector
  CameraFollowUpper: DynamicVector
  CameraFollowMaxDegree: number
  CameraFollowMinDegree: number
  CameraFastFocusMode: boolean
  FaceToTarget: boolean
  FaceToTargetAngleThreshold: number
  ChangeMainSkillID: boolean
  DragButtonName: string
  Assistance: FocusAssistanceGroup
  CanMove: boolean
  ShowCrosshair: boolean
  FocusAnchorHorAngle: number
  FocusAnchorVerAngle: number
  DisableAnim: boolean
}

export interface AvatarExitCameraShot extends ConfigBaseAbilityAction {
  $type: "AvatarExitCameraShot"
  ShotType: string
}

export interface AvatarExitClimb extends ConfigBaseAbilityAction {
  $type: "AvatarExitClimb"
}

export interface AvatarExitFocus extends ConfigBaseAbilityAction {
  $type: "AvatarExitFocus"
  KeepRotation: boolean
}

export interface AvatarSkillStart extends ConfigBaseAbilityAction {
  $type: "AvatarSkillStart"
  SkillID: number
  CdRatio?: DynamicFloat
  CostStaminaRatio?: DynamicFloat
}

export interface BanEntityMark extends ConfigBaseAbilityAction {
  $type: "BanEntityMark"
  IsBan: boolean
}

export interface BroadcastNeuronStimulate extends ConfigBaseAbilityAction {
  $type: "BroadcastNeuronStimulate"
  NeuronName: string
  Stimulate: boolean
  Range: number
}

export interface CalcDvalinS04RebornPoint extends ConfigBaseAbilityAction {
  $type: "CalcDvalinS04RebornPoint"
  Enable: boolean
}

export interface CallLuaTask extends ConfigBaseAbilityAction {
  $type: "CallLuaTask"
  TargetAlias: string
  ValueInt: number
  ValueFloat: number
  ValueString: string
}

export interface ChangeEnviroWeather extends ConfigBaseAbilityAction {
  $type: "ChangeEnviroWeather"
  AreaId: number
  ClimateType: number
  TransDuration: number
}

export interface ChangeFollowDampTime extends ConfigBaseAbilityAction {
  $type: "ChangeFollowDampTime"
  EffectPattern: string
  PositionDampTime: DynamicFloat
  RotationDampTime: DynamicFloat
}

export interface ChangeGadgetUIInteractHint extends ConfigBaseAbilityAction {
  $type: "ChangeGadgetUIInteractHint"
  HintTextMapId: string
}
export interface ChangeGadgetState {
  $type: "ChangeGadgetState"
  State: GadgetStateEnum
}

export interface ChangePlayMode extends ConfigBaseAbilityAction {
  $type: "ChangePlayMode"
  ToPlayMode: string
}

export interface ChangeTag extends ConfigBaseAbilityAction {
  $type: "ChangeTag"
  IsAdd: boolean
  Tag: string
}

export interface ClearEndura extends ConfigBaseAbilityAction {
  $type: "ClearEndura"
  Percent: number
}

export interface ClearGlobalPos extends ConfigBaseAbilityAction {
  $type: "ClearGlobalPos"
  Key: string
  SetTarget: boolean
}

export interface ClearGlobalValue extends ConfigBaseAbilityAction {
  $type: "ClearGlobalValue"
  Key: string
}

export interface ClearLockTarget extends ConfigBaseAbilityAction {
  $type: "ClearLockTarget"
}

export interface ClearPos extends ConfigBaseAbilityAction {
  $type: "ClearPos"
}

export interface ControlEmotion extends ConfigBaseAbilityAction {
  $type: "ControlEmotion"
  ToggleEmoSync: boolean
  ToggleBlink: boolean
  ToggleEyeKey: boolean
}

export interface CopyGlobalValue extends ConfigBaseAbilityAction {
  $type: "CopyGlobalValue"
  SrcTarget: string
  DstTarget: string
  SrcKey: string
  DstKey: string
}

export interface DamageByAttackValue extends ConfigBaseAbilityAction {
  $type: "DamageByAttackValue"
  Attacker?: string
  Born?: ConfigBornType
  AttackInfo: ConfigAttackInfo
}

export interface DebugLog extends ConfigBaseAbilityAction {
  $type: "DebugLog"
  Content: string
}

export interface DoBlink extends ConfigBaseAbilityAction {
  $type: "DoBlink"
}

export interface DoTileAction extends ConfigBaseAbilityAction {
  $type: "DoTileAction"
  ActionID: string
}

export interface DoWatcherSystemAction extends ConfigBaseAbilityAction {
  $type: "DoWatcherSystemAction"
  WatcherId: number
  AuthorityOnly?: boolean
  InThreatListOnly?: boolean
}

export interface DoWidgetSystemAction extends ConfigBaseAbilityAction {
  $type: "DoWidgetSystemAction"
  WidgetEvent: string
}

export interface DropSubfield extends ConfigBaseAbilityAction {
  $type: "DropSubfield"
  SubfieldName: string
}

export interface DummyAction extends ConfigBaseAbilityAction {
  $type: "DummyAction"
  ActionList: ConfigAbilityAction[]
}

export interface DungeonFogEffects extends ConfigBaseAbilityAction {
  $type: "DungeonFogEffects"
  Enable?: boolean
  CameraFogEffectName: string
  PlayerFogEffectName: string
  LocalOffset?: DynamicVector
}

export interface EnableAfterImage extends ConfigBaseAbilityAction {
  $type: "EnableAfterImage"
  Enable: boolean
  Index: number
}

export interface EnableAIStealthy extends ConfigBaseAbilityAction {
  $type: "EnableAIStealthy"
  Enable: boolean
}

export interface EnableAvatarFlyStateTrail extends ConfigBaseAbilityAction {
  $type: "EnableAvatarFlyStateTrail"
  SetEnable: boolean
}

export interface EnableBulletCollisionPluginTrigger extends ConfigBaseAbilityAction {
  $type: "EnableBulletCollisionPluginTrigger"
  SetEnable?: boolean
}

export interface EnableCameraDof extends ConfigBaseAbilityAction {
  $type: "EnableCameraDof"
  EnableDof: boolean
}

export interface EnableCrashDamage extends ConfigBaseAbilityAction {
  $type: "EnableCrashDamage"
  Enable: boolean
}

export interface EnableGadgetIntee extends ConfigBaseAbilityAction {
  $type: "EnableGadgetIntee"
  Enable: boolean
}

export interface EnableHeadControl extends ConfigBaseAbilityAction {
  $type: "EnableHeadControl"
  Enable: boolean
  Blend: boolean
}

export interface EnableHitAutoRedirect extends ConfigBaseAbilityAction {
  $type: "EnableHitAutoRedirect"
  SetEnable: boolean
}

export interface EnableHitBoxByName extends ConfigBaseAbilityAction {
  $type: "EnableHitBoxByName"
  HitBoxNames: string[]
  SetEnable?: boolean
}

export interface EnableMainInterface extends ConfigBaseAbilityAction {
  $type: "EnableMainInterface"
  Enable: boolean
}

export interface EnableMonsterMoveOnWater extends ConfigBaseAbilityAction {
  $type: "EnableMonsterMoveOnWater"
  Enable: boolean
}

export interface EnablePartControl extends ConfigBaseAbilityAction {
  $type: "EnablePartControl"
  PartRootNames: string[]
  Enable: boolean
}

export interface EnablePositionSynchronization extends ConfigBaseAbilityAction {
  $type: "EnablePositionSynchronization"
  Enable: boolean
}

export interface EnablePushColliderName extends ConfigBaseAbilityAction {
  $type: "EnablePushColliderName"
  PushColliderNames: string[]
  SetEnable: boolean
}

export interface EnableRocketJump extends ConfigBaseAbilityAction {
  $type: "EnableRocketJump"
  Type: string
  Enable: boolean
  Extention: RocketJumpExt
}

export interface EnableSceneTransformByName extends ConfigBaseAbilityAction {
  $type: "EnableSceneTransformByName"
  TransformNames: string[]
  SetEnable: boolean
}

export interface EnableWetElectricHitBox extends ConfigBaseAbilityAction {
  $type: "EnableWetElectricHitBox"
  Enabled: boolean
}

export interface EnterCameraLock extends ConfigBaseAbilityAction {
  $type: "EnterCameraLock"
  TransName: string
  CfgPath: string
}

export interface EntityDoSkill extends ConfigBaseAbilityAction {
  $type: "EntityDoSkill"
  SkillID: number
  IsHold: boolean
}

export interface EquipAffixStart extends ConfigBaseAbilityAction {
  $type: "EquipAffixStart"
  CD: DynamicFloat
  EquipAffixDataID: number
}

export interface ExecuteGadgetLua extends ConfigBaseAbilityAction {
  $type: "ExecuteGadgetLua"
  Param1?: number
  Param2?: number
  Param3?: number
}

export interface ExecuteGroupTrigger extends ConfigBaseAbilityAction {
  $type: "ExecuteGroupTrigger"
  SourceName: string
  Param1: number
  Param2: number
  Param3: number
}

export interface FireAISoundEvent extends ConfigBaseAbilityAction {
  $type: "FireAISoundEvent"
  Volume: number
}

export interface FireAudio extends ConfigBaseAbilityAction {
  $type: "FireAudio"
  AudioPattern: string
  ForcePlay: boolean
}

export interface FireEffect extends ConfigBaseAbilityAction {
  $type: "FireEffect"
  EffectPattern: string
  OthereffectPatterns?: string[]
  Born: ConfigBornType
  OwnedByLevel?: boolean
  UseY?: boolean
  Scale?: number
  EffectTempleteID?: number
}

export interface FireEffectForStorm extends ConfigBaseAbilityAction {
  $type: "FireEffectForStorm"
  Born: ConfigBornType
  Height: number
}

export interface FireEffectToTarget extends ConfigBaseAbilityAction {
  $type: "FireEffectToTarget"
  EffectPattern: string
  Reverse: boolean
  FromSelf: boolean
  Scale: number
}

export interface FireGainCrystalSeedEvent extends ConfigBaseAbilityAction {
  $type: "FireGainCrystalSeedEvent"
  ElementType: string
}

export interface FireHitEffect extends ConfigBaseAbilityAction {
  $type: "FireHitEffect"
  HitEntity: string
  HitScene: ConfigHitScene
}

export interface FireMonsterBeingHitAfterImage extends ConfigBaseAbilityAction {
  $type: "FireMonsterBeingHitAfterImage"
  EffectIndex: number
}

export interface FireSubEmitterEffect extends ConfigBaseAbilityAction {
  $type: "FireSubEmitterEffect"
  EffectPattern: string
  Born: ConfigBornType
  Scale: number
}

export interface FireUIEffect extends ConfigBaseAbilityAction {
  $type: "FireUIEffect"
  EffectPattern: string
  EffectSlot: string
}

export interface FixedAvatarRushMove extends ConfigBaseAbilityAction {
  $type: "FixedAvatarRushMove"
  ToPos: ConfigBornType
  TimeRange: DynamicFloat
  MaxRange: number
  AnimatorStateIDs: string[]
  OverrideMoveCollider: string
  IsInAir: boolean
  CheckAnimatorStateOnExitOnly: boolean
}

export interface FixedMonsterRushMove extends ConfigBaseAbilityAction {
  $type: "FixedMonsterRushMove"
  ToPos: ConfigBornType
  TimeRange: DynamicFloat
  MaxRange?: number
  AnimatorStateIDs: string[]
  OverrideMoveCollider: string
  IsInAir?: boolean
  CheckAnimatorStateOnExitOnly?: boolean
}

export interface ForceAirStateFly extends ConfigBaseAbilityAction {
  $type: "ForceAirStateFly"
  IsActive: boolean
}

export interface ForceInitMassiveEntity extends ConfigBaseAbilityAction {
  $type: "ForceInitMassiveEntity"
  Born: ConfigBornType
  Radius: number
  Angle: number
  Height: number
}

export interface ForceTriggerJump extends ConfigBaseAbilityAction {
  $type: "ForceTriggerJump"
}

export interface ForceUseSkillSuccess extends ConfigBaseAbilityAction {
  $type: "ForceUseSkillSuccess"
  SkillID: number
  Type: string
  Immediately: boolean
}

export interface GenerateElemBall extends ConfigBaseAbilityAction {
  $type: "GenerateElemBall"
  DropType: string
  ConfigID: number
  Born: ConfigBornType
  Ratio: DynamicFloat
  BaseEnergy: number
}

export interface GetPos extends ConfigBaseAbilityAction {
  $type: "GetPos"
  Key: string
  PosType: string
}

export interface GuidePaimonDisappearEnd extends ConfigBaseAbilityAction {
  $type: "GuidePaimonDisappearEnd"
}

export interface HealHP extends ConfigBaseAbilityAction {
  $type: "HealHP"
  Amount?: DynamicFloat
  AmountByCasterMaxHPRatio?: DynamicFloat
  AmountByTargetMaxHPRatio?: DynamicFloat
  AmountByTargetCurrentHPRatio?: DynamicFloat
  AmountByCasterAttackRatio?: DynamicFloat
  MuteHealEffect?: boolean
  HealRatio?: number
  Target?: string
  CdRatio?: string
  IgnoreAbilityProperty?: boolean
}

export interface HealSP extends ConfigBaseAbilityAction {
  $type: "HealSP"
  Amount: DynamicFloat
  AmountByCasterMaxSPRatio: DynamicFloat
  AmountByTargetMaxSPRatio: DynamicFloat
  AmountByCurrentComboRatio: DynamicFloat
  MuteHealEffect: boolean
  HealRatio: number
}

export interface HideUIBillBoard extends ConfigBaseAbilityAction {
  $type: "HideUIBillBoard"
  Hide: boolean
}

export interface IssueCommand extends ConfigBaseAbilityAction {
  $type: "IssueCommand"
  CommandID: number
  Duration: number
}

export interface KillGadget extends ConfigBaseAbilityAction {
  $type: "KillGadget"
  GadgetInfo: SelectTargetsByChildren
}

export interface KillPlayEntity extends ConfigBaseAbilityAction {
  $type: "KillPlayEntity"
}

export interface KillSelf extends ConfigBaseAbilityAction {
  $type: "KillSelf"
  Duration?: number
  DieStateFlag?: string
  BanDrop?: boolean
  BanExp?: boolean
  BanHPPercentageDrop?: boolean
  KillSelfType: string
  HideEntity?: boolean
}

export interface LoseHP extends ConfigBaseAbilityAction {
  $type: "LoseHP"
  Amount?: DynamicFloat
  AmountByCasterMaxHPRatio?: DynamicFloat
  AmountByTargetMaxHPRatio?: DynamicFloat
  AmountByTargetCurrentHPRatio?: DynamicFloat
  AmountByCasterAttackRatio?: DynamicFloat
  Lethal?: boolean
  EnableInvincible?: boolean
  EnableLockHP?: boolean
  DisableWhenLoading?: boolean
}

export interface ModifyAvatarSkillCD extends ConfigBaseAbilityAction {
  $type: "ModifyAvatarSkillCD"
  SkillID: number
  SkillSlot: number[]
  CdDelta: DynamicFloat
  CdRatio: DynamicFloat
}

export interface MultiplyGlobalValue extends ConfigBaseAbilityAction {
  $type: "MultiplyGlobalValue"
  Value: DynamicFloat
  Key: string
  UseLimitRange: boolean
  RandomInRange: boolean
  MaxValue: DynamicFloat
  MinValue: DynamicFloat
}

export interface PaimonAction extends ConfigBaseAbilityAction {
  $type: "PaimonAction"
  From: string
  ActionName: string
}

export interface PlayEmojiBubble extends ConfigBaseAbilityAction {
  $type: "PlayEmojiBubble"
  Name: string
}

export interface PlayEmoSync extends ConfigBaseAbilityAction {
  $type: "PlayEmoSync"
  DialogID: number
  EmoSyncAssetPath: string
}

export interface PushDvalinS01Process extends ConfigBaseAbilityAction {
  $type: "PushDvalinS01Process"
  Time: number
  ToPercentage: number
  UnBreak: boolean
  SetForce: boolean
  Vector: DynamicVector
  Attenuation: number
}

export interface PushPos extends ConfigBaseAbilityAction {
  $type: "PushPos"
  PosType: ConfigBornType
  SaveTo: string
}

export interface Randomed extends ConfigBaseAbilityAction {
  $type: "Randomed"
  Chance: DynamicFloat
  SuccessActions: ConfigAbilityAction[]
  FailActions: ConfigAbilityAction[]
}

export interface RegisterAIActionPoint extends ConfigBaseAbilityAction {
  $type: "RegisterAIActionPoint"
  PointType: string
}

export interface RegistToStageScript extends ConfigBaseAbilityAction {
  $type: "RegistToStageScript"
  Alias: string
}

export interface ReleaseAIActionPoint extends ConfigBaseAbilityAction {
  $type: "ReleaseAIActionPoint"
  PointType: string | number
}

export interface RemoveAvatarSkillInfo extends ConfigBaseAbilityAction {
  $type: "RemoveAvatarSkillInfo"
  SkillID: number
}

export interface RemoveModifier extends ConfigBaseAbilityAction {
  $type: "RemoveModifier"
  ModifierName: string
}

export interface RemoveServerBuff extends ConfigBaseAbilityAction {
  $type: "RemoveServerBuff"
  SBuffId: number
  IsTeamBuff: boolean
}

export interface RemoveUniqueModifier extends ConfigBaseAbilityAction {
  $type: "RemoveUniqueModifier"
  ModifierName: string
}

export interface RemoveVelocityForce extends ConfigBaseAbilityAction {
  $type: "RemoveVelocityForce"
  Forces: string[]
}

export interface Repeated extends ConfigBaseAbilityAction {
  $type: "Repeated"
  RepeatTimes: DynamicInt
  Actions: ConfigAbilityAction[]
}

export interface ResetAbilitySpecial extends ConfigBaseAbilityAction {
  $type: "ResetAbilitySpecial"
  KeyName: string
  ValueName: string
}

export interface ResetAIAttackTarget extends ConfigBaseAbilityAction {
  $type: "ResetAIAttackTarget"
}

export interface ResetAIResistTauntLevel extends ConfigBaseAbilityAction {
  $type: "ResetAIResistTauntLevel"
  ResistTauntLevel: string
}

export interface ResetAIThreatBroadcastRange extends ConfigBaseAbilityAction {
  $type: "ResetAIThreatBroadcastRange"
  Range: DynamicFloat
}

export interface ResetAnimatorTrigger extends ConfigBaseAbilityAction {
  $type: "ResetAnimatorTrigger"
  TriggerID: string
}

export interface ResetAvatarHitBuckets extends ConfigBaseAbilityAction {
  $type: "ResetAvatarHitBuckets"
}

export interface ResetClimateMeter extends ConfigBaseAbilityAction {
  $type: "ResetClimateMeter"
  ClimateType: string | number
}

export interface ResetEnviroEular extends ConfigBaseAbilityAction {
  $type: "ResetEnviroEular"
  EularAngles: DynamicVector
}

export interface ReTriggerAISkillInitialCD extends ConfigBaseAbilityAction {
  $type: "ReTriggerAISkillInitialCD"
  SkillIDs: number[]
}

export interface ReviveAvatar extends Omit<HealHP, "$type"> {
  $type: "ReviveAvatar"
}

export interface ReviveDeadAvatar extends Omit<ReviveAvatar, "$type"> {
  $type: "ReviveDeadAvatar"
  IsReviveOtherPlayerAvatar: boolean
  SkillID: number
  CdRatio: string
  Range: number
}

export interface ReviveElemEnergy extends ConfigBaseAbilityAction {
  $type: "ReviveElemEnergy"
  Value: DynamicFloat
}

export interface ReviveStamina extends ConfigBaseAbilityAction {
  $type: "ReviveStamina"
  Value: DynamicFloat
}

export interface RushMove extends ConfigBaseAbilityAction {
  $type: "RushMove"
  ToPos: ConfigBornType
  MinRange: number
  MaxRange: number
  TimeRange: number
}

export interface SendEffectTrigger extends ConfigBaseAbilityAction {
  $type: "SendEffectTrigger"
  Parameter: string
  Type?: string
  Value?: number
  EffectPattern: string
}

export interface ServerLuaCall extends ConfigBaseAbilityAction {
  $type: "ServerLuaCall"
  LuaCallType: string
  IsTarget: boolean
  CallParamList: number[]
  FuncName: string
}

export interface ServerMonsterLog extends ConfigBaseAbilityAction {
  $type: "ServerMonsterLog"
  ParamList: number[]
}

export interface SetAIHitFeeling extends ConfigBaseAbilityAction {
  $type: "SetAIHitFeeling"
  Enable: boolean
}

export interface SetAIParam extends ConfigBaseAbilityAction {
  $type: "SetAIParam"
  Param: string
  Value: DynamicFloat
  IsBool: boolean
  LogicType: string
}

export interface SetAISkillCDAvailableNow extends ConfigBaseAbilityAction {
  $type: "SetAISkillCDAvailableNow"
  SkillIDs: number[]
}

export interface SetAISkillCDMultiplier extends ConfigBaseAbilityAction {
  $type: "SetAISkillCDMultiplier"
  Multiplier: number
}

export interface SetAISkillGCD extends ConfigBaseAbilityAction {
  $type: "SetAISkillGCD"
  Value: number
}

export interface SetAnimatorBool extends ConfigBaseAbilityAction {
  $type: "SetAnimatorBool"
  BoolID: string
  Value?: boolean
  Persistent?: boolean
}

export interface SetAnimatorFloat extends ConfigBaseAbilityAction {
  $type: "SetAnimatorFloat"
  FloatID: string
  Value: DynamicFloat
  Persistent: boolean
  UseRandomValue: boolean
  RandomValueMin: DynamicFloat
  RandomValueMax: DynamicFloat
}

export interface SetAnimatorInt extends ConfigBaseAbilityAction {
  $type: "SetAnimatorInt"
  IntID: string
  Value: DynamicFloat
  Persistent: boolean
}

export interface SetAnimatorTrigger extends ConfigBaseAbilityAction {
  $type: "SetAnimatorTrigger"
  TriggerID: string
  MPTriggerOnRemote: boolean
}

export interface SetAvatarCanShakeOff extends ConfigBaseAbilityAction {
  $type: "SetAvatarCanShakeOff"
  CanShakeOff: boolean
}

export interface SetAvatarHitBuckets extends ConfigBaseAbilityAction {
  $type: "SetAvatarHitBuckets"
  OverrideAvatarHitBucketSetting: ConfigAvatarHitBucketSetting
}

export interface SetCameraLockTime extends ConfigBaseAbilityAction {
  $type: "SetCameraLockTime"
  LockTime: number
}

export interface SetCanDieImmediately extends ConfigBaseAbilityAction {
  $type: "SetCanDieImmediately"
  DieImmediately: boolean
}

export interface SetCombatFixedMovePoint extends ConfigBaseAbilityAction {
  $type: "SetCombatFixedMovePoint"
  SetPoint: boolean
  ToPos: ConfigBornType
}

export interface SetCrashDamage extends ConfigBaseAbilityAction {
  $type: "SetCrashDamage"
  Key: string
}

export interface SetCrystalShieldHpToOverrideMap extends ConfigBaseAbilityAction {
  $type: "SetCrystalShieldHpToOverrideMap"
  OverrideMapKey: string
}

export interface SetDvalinS01FlyState extends ConfigBaseAbilityAction {
  $type: "SetDvalinS01FlyState"
  ToState: number
}

export interface SetEmissionScaler extends ConfigBaseAbilityAction {
  $type: "SetEmissionScaler"
  MaterialType: string
  UseDefaultColor: boolean
  Value: number
  Duration: number
}

export interface SetEntityScale extends ConfigBaseAbilityAction {
  $type: "SetEntityScale"
  Scale: number
}

export interface SetExtraAbilityEnable extends ConfigBaseAbilityAction {
  $type: "SetExtraAbilityEnable"
  Enable: boolean
}

export interface SetExtraAbilityState extends ConfigBaseAbilityAction {
  $type: "SetExtraAbilityState"
  State: string
}

export interface SetGlobalDir extends ConfigBaseAbilityAction {
  $type: "SetGlobalDir"
  Key: string
  Born: ConfigBornType
  SetTarget: boolean
}

export interface SetGlobalPos extends ConfigBaseAbilityAction {
  $type: "SetGlobalPos"
  Key: string
  Born: ConfigBornType
  SetTarget: boolean
}

export interface SetGlobalValue extends ConfigBaseAbilityAction {
  $type: "SetGlobalValue"
  Value: number
  Key: string
  UseLimitRange?: boolean
  RandomInRange?: boolean
  MaxValue: number
  MinValue: number
}

export interface SetGlobalValueByTargetDistance extends ConfigBaseAbilityAction {
  $type: "SetGlobalValueByTargetDistance"
  Key: string
  IsXZ?: boolean
}

export interface SetGlobalValueList extends ConfigBaseAbilityAction {
  $type: "SetGlobalValueList"
  GlobalValueList: GlobalValuePair[]
}

export interface SetGlobalValueToOverrideMap extends ConfigBaseAbilityAction {
  $type: "SetGlobalValueToOverrideMap"
  AbilityFormula?: string
  IsFromOwner?: boolean
  GlobalValueKey: string
  OverrideMapKey: string
}

export interface SetKeepInAirVelocityForce extends ConfigBaseAbilityAction {
  $type: "SetKeepInAirVelocityForce"
  SetEnable: boolean
}

export interface SetNeuronEnable extends ConfigBaseAbilityAction {
  $type: "SetNeuronEnable"
  NeuronName: string
  Enable: boolean
}

export interface SetNeuronMute extends ConfigBaseAbilityAction {
  $type: "SetNeuronMute"
  NeuronName: string
  Enable: boolean
}

export interface SetOverrideMapValue extends ConfigBaseAbilityAction {
  $type: "SetOverrideMapValue"
  Value: number
  OverrideMapKey: string
}

export interface SetPaimonLookAtAvatar extends ConfigBaseAbilityAction {
  $type: "SetPaimonLookAtAvatar"
  From: string
  Lookat: boolean
  MinTime: number
  MaxTime: number
}

export interface SetPaimonLookAtCamera extends ConfigBaseAbilityAction {
  $type: "SetPaimonLookAtCamera"
  From: string
  Lookat: boolean
  MinTime: number
  MaxTime: number
}

export interface SetPaimonTempOffset extends ConfigBaseAbilityAction {
  $type: "SetPaimonTempOffset"
  From: string
  OffSetPos: DynamicVector
  Time: number
}

export interface SetPartControlTarget extends ConfigBaseAbilityAction {
  $type: "SetPartControlTarget"
  PartRootNames: string[]
  TargetType: string
}

export interface SetPoseBool extends ConfigBaseAbilityAction {
  $type: "SetPoseBool"
  BoolID: string
  Value?: boolean
}

export interface SetPoseFloat extends ConfigBaseAbilityAction {
  $type: "SetPoseFloat"
  FloatID: string
  Value: DynamicFloat
}

export interface SetPoseInt extends ConfigBaseAbilityAction {
  $type: "SetPoseInt"
  IntID: string
  Value: number
}

export interface SetRandomOverrideMapValue extends ConfigBaseAbilityAction {
  $type: "SetRandomOverrideMapValue"
  ValueRangeMax: number
  ValueRangeMin: number
  OverrideMapKey: string
}

export interface SetSelfAttackTarget extends ConfigBaseAbilityAction {
  $type: "SetSelfAttackTarget"
  TurnToTargetImmediately: boolean
  TurnToTargetKeepUpAxisDirection: boolean
}

export interface SetSkillAnchor extends ConfigBaseAbilityAction {
  $type: "SetSkillAnchor"
  Born: ConfigBornType
}

export interface SetSurroundAnchor extends ConfigBaseAbilityAction {
  $type: "SetSurroundAnchor"
  SetPoint: boolean
  ActionPointType: string
  ActionPointID: number
}

export interface SetSystemValueToOverrideMap extends ConfigBaseAbilityAction {
  $type: "SetSystemValueToOverrideMap"
  Key: string
  Type: string
}

export interface SetVelocityIgnoreAirGY extends ConfigBaseAbilityAction {
  $type: "SetVelocityIgnoreAirGY"
  IgnoreAirGY: boolean
}

export interface SetWeaponAttachPointRealName extends ConfigBaseAbilityAction {
  $type: "SetWeaponAttachPointRealName"
  PartName: string
  RealName: string
}

export interface SetWeaponBindState extends ConfigBaseAbilityAction {
  $type: "SetWeaponBindState"
  Place: boolean
  EquipPartName: string
  Born: ConfigBornType
}

export interface ShowExtraAbility extends ConfigBaseAbilityAction {
  $type: "ShowExtraAbility"
  SkillID: number
}

export interface ShowProgressBarAction extends ConfigBaseAbilityAction {
  $type: "ShowProgressBarAction"
  Show: boolean
}

export interface ShowReminder extends ConfigBaseAbilityAction {
  $type: "ShowReminder"
  Id: number
}

export interface ShowScreenEffect extends ConfigBaseAbilityAction {
  $type: "ShowScreenEffect"
  EffectType: string
  Show: boolean
}

export interface ShowUICombatBar extends ConfigBaseAbilityAction {
  $type: "ShowUICombatBar"
  Show: boolean
  Fore: boolean
}

export interface SpawnAttach extends ConfigBaseAbilityAction {
  $type: "SpawnAttach"
  Enable: boolean
  AttachName: string
}

export interface StartDither extends ConfigBaseAbilityAction {
  $type: "StartDither"
  Duration: number
  Reverse?: boolean
}

export interface Summon extends ConfigBaseAbilityAction {
  $type: "Summon"
  MonsterID: number
  Born: ConfigBornType
  BornSlotIndex: number
  FaceToTarget: string
  SummonTag: number
  AliveByOwner: boolean
  IsElite: boolean
  AffixList: number[]
  LevelDelta: DynamicInt
  HasDrop: boolean
  HasExp: boolean
  SightGroupWithOwner: boolean
}

export interface SumTargetWeightToSelfGlobalValue extends ConfigBaseAbilityAction {
  $type: "SumTargetWeightToSelfGlobalValue"
  Key: string
}

export interface SyncEntityPositionByNormalizedTime extends ConfigBaseAbilityAction {
  $type: "SyncEntityPositionByNormalizedTime"
  NormalizedTime: number
}

export interface SyncToStageScript extends ConfigBaseAbilityAction {
  $type: "SyncToStageScript"
  Alias: string
}

export interface ToNearstAnchorPoint extends ConfigBaseAbilityAction {
  $type: "ToNearstAnchorPoint"
}

export interface TriggerAbility extends ConfigBaseAbilityAction {
  $type: "TriggerAbility"
  AbilityName: string
  AbilitySpecials: { [key: string]: DynamicFloat }
  ForceUseSelfCurrentAttackTarget: boolean
}

export interface TriggerAttackEvent extends ConfigBaseAbilityAction {
  $type: "TriggerAttackEvent"
  AttackEvent: ConfigAttackEvent
  TargetType: string
}

export interface TriggerAttackTargetMapEvent extends ConfigBaseAbilityAction {
  $type: "TriggerAttackTargetMapEvent"
  AttackTargetMapEvent: ConfigAttackTargetMapEvent
}

export interface TriggerAudio extends ConfigBaseAbilityAction {
  $type: "TriggerAudio"
  Responder: string
  Operation: ConfigAudioOperation
}

export interface TriggerAuxWeaponTrans extends ConfigBaseAbilityAction {
  $type: "TriggerAuxWeaponTrans"
  SetEnable: boolean
  EquipPart: string
}

export interface TriggerBullet extends ConfigBaseAbilityAction {
  $type: "TriggerBullet"
  BulletID: number
  Born: ConfigBornType
  OwnerIsTarget: boolean
  OwnerIs: string
  PropOwnerIs: string
  LifeByOwnerIsAlive: boolean
  TrackTarget: string
  SightGroupWithOwner: boolean
}

export interface TriggerCreateGadgetToEquipPart extends ConfigBaseAbilityAction {
  $type: "TriggerCreateGadgetToEquipPart"
  GadgetID: number
  EquipPart: string
}

export interface TriggerDropEquipParts extends ConfigBaseAbilityAction {
  $type: "TriggerDropEquipParts"
  DropAll: boolean
  EquipParts: string[]
}

export interface TriggerFaceAnimation extends ConfigBaseAbilityAction {
  $type: "TriggerFaceAnimation"
  FaceAnimation: string
}

export interface TriggerGadgetInteractive extends ConfigBaseAbilityAction {
  $type: "TriggerGadgetInteractive"
}

export interface TriggerHideWeapon extends ConfigBaseAbilityAction {
  $type: "TriggerHideWeapon"
  Visible: boolean
  PartNames: string[]
}

export interface TriggerPlayerDie extends ConfigBaseAbilityAction {
  $type: "TriggerPlayerDie"
}

export interface TriggerSetCastShadow extends ConfigBaseAbilityAction {
  $type: "TriggerSetCastShadow"
  CastShadow: boolean
}

export interface TriggerSetChestLock extends ConfigBaseAbilityAction {
  $type: "TriggerSetChestLock"
  Locked: boolean
}

export interface TriggerSetPassThrough extends ConfigBaseAbilityAction {
  $type: "TriggerSetPassThrough"
  PassThrough: boolean
}

export interface TriggerSetRenderersEnable extends ConfigBaseAbilityAction {
  $type: "TriggerSetRenderersEnable"
  RenderNames: string[]
  SetEnable: boolean
}

export interface TriggerSetVisible extends ConfigBaseAbilityAction {
  $type: "TriggerSetVisible"
  Visible: boolean
}

export interface TriggerTaunt extends ConfigBaseAbilityAction {
  $type: "TriggerTaunt"
  TauntLevel: string
  CareValue: number
}

export interface TriggerThrowEquipPart extends ConfigBaseAbilityAction {
  $type: "TriggerThrowEquipPart"
  EquipPart: string
  ChaseAttackTarget: boolean
  Born: ConfigBornType
}

export interface TryFindBlinkPoint extends ConfigBaseAbilityAction {
  $type: "TryFindBlinkPoint"
  ForwardAngle: number
  MinRange: number
  MaxRange: number
  LimitY: number
  IgnoreWater: boolean
}

export interface TryFindBlinkPointByBorn extends ConfigBaseAbilityAction {
  $type: "TryFindBlinkPointByBorn"
  Born: ConfigBornType
  HitSceneTest: boolean
  HitSceneType: string
  LimitY: DynamicFloat
}

export interface TryTriggerPlatformStartMove extends ConfigBaseAbilityAction {
  $type: "TryTriggerPlatformStartMove"
  DetectHeight: number
  DetectWidth: number
  EnableRotationOffset: boolean
  FailActions: ConfigAbilityAction[]
  ForceReset: boolean
  ForceTrigger: boolean
}

export interface TurnDirection extends ConfigBaseAbilityAction {
  $type: "TurnDirection"
  TurnMode: string
}

export interface TurnDirectionToPos extends ConfigBaseAbilityAction {
  $type: "TurnDirectionToPos"
  ToPos: ConfigBornType
  MinAngle: number
  MaxAngle: number
}

export interface UnlockSkill extends ConfigBaseAbilityAction {
  $type: "UnlockSkill"
  SkillID: number
}

export interface UpdateReactionDamage extends ConfigBaseAbilityAction {
  $type: "UpdateReactionDamage"
  LevelTarget: string
  ReactionDamageName: string
}

export interface UpdateUidValue extends ConfigBaseAbilityAction {
  $type: "UpdateUidValue"
}

export interface UseItem extends ConfigBaseAbilityAction {
  $type: "UseItem"
  ItemId: number
  ItemNum: number
}

export interface UseSkillEliteSet extends ConfigBaseAbilityAction {
  $type: "UseSkillEliteSet"
  SkillEliteSetID: number
}

export { CreateEntity, UtilityAction }
