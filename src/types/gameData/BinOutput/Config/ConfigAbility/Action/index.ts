import {
  ActCameraRadialBlur,
  ActCameraShake,
  ActTimeSlow,
  AddAvatarSkillInfo,
  AddClimateMeter,
  AddElementDurability,
  AddGlobalPos,
  AddGlobalValue,
  AddGlobalValueToTarget,
  AddServerBuff,
  ApplyLevelModifier,
  ApplyModifier,
  AttachAbilityStateResistance,
  AttachBulletAimPoint,
  AttachEffect,
  AttachElementTypeResistance,
  AttachLight,
  AttachModifier,
  AvatarCameraParam,
  AvatarDoBlink,
  AvatarEnterCameraShot,
  AvatarEnterFocus,
  AvatarExitCameraShot,
  AvatarExitClimb,
  AvatarExitFocus,
  AvatarSkillStart,
  BanEntityMark,
  BroadcastNeuronStimulate,
  CalcDvalinS04RebornPoint,
  CallLuaTask,
  ChangeEnviroWeather,
  ChangeFollowDampTime,
  ChangeGadgetUIInteractHint,
  ChangePlayMode,
  ChangeTag,
  ClearEndura,
  ClearGlobalPos,
  ClearGlobalValue,
  ClearLockTarget,
  ClearPos,
  ControlEmotion,
  CopyGlobalValue,
  CreateEntity,
  DamageByAttackValue,
  DebugLog,
  DoBlink,
  DoTileAction,
  DoWatcherSystemAction,
  DoWidgetSystemAction,
  DropSubfield,
  DummyAction,
  DungeonFogEffects,
  EnableAfterImage,
  EnableAIStealthy,
  EnableAvatarFlyStateTrail,
  EnableBulletCollisionPluginTrigger,
  EnableCameraDof,
  EnableCrashDamage,
  EnableGadgetIntee,
  EnableHeadControl,
  EnableHitAutoRedirect,
  EnableHitBoxByName,
  EnableMainInterface,
  EnableMonsterMoveOnWater,
  EnablePartControl,
  EnablePositionSynchronization,
  EnablePushColliderName,
  EnableRocketJump,
  EnableSceneTransformByName,
  EnableWetElectricHitBox,
  EnterCameraLock,
  EntityDoSkill,
  EquipAffixStart,
  ExecuteGadgetLua,
  ExecuteGroupTrigger,
  FireAISoundEvent,
  FireAudio,
  FireEffect,
  FireEffectForStorm,
  FireEffectToTarget,
  FireGainCrystalSeedEvent,
  FireHitEffect,
  FireMonsterBeingHitAfterImage,
  FireSubEmitterEffect,
  FireUIEffect,
  FixedAvatarRushMove,
  FixedMonsterRushMove,
  ForceAirStateFly,
  ForceInitMassiveEntity,
  ForceTriggerJump,
  ForceUseSkillSuccess,
  GenerateElemBall,
  GetPos,
  GuidePaimonDisappearEnd,
  HealHP,
  HealSP,
  HideUIBillBoard,
  IssueCommand,
  KillGadget,
  KillPlayEntity,
  KillSelf,
  LoseHP,
  ModifyAvatarSkillCD,
  MultiplyGlobalValue,
  PaimonAction,
  PlayEmojiBubble,
  PlayEmoSync,
  PushDvalinS01Process,
  PushPos,
  Randomed,
  RegisterAIActionPoint,
  RegistToStageScript,
  ReleaseAIActionPoint,
  RemoveAvatarSkillInfo,
  RemoveModifier,
  RemoveServerBuff,
  RemoveUniqueModifier,
  RemoveVelocityForce,
  Repeated,
  ResetAbilitySpecial,
  ResetAIAttackTarget,
  ResetAIResistTauntLevel,
  ResetAIThreatBroadcastRange,
  ResetAnimatorTrigger,
  ResetAvatarHitBuckets,
  ResetClimateMeter,
  ResetEnviroEular,
  ReTriggerAISkillInitialCD,
  ReviveAvatar,
  ReviveDeadAvatar,
  ReviveElemEnergy,
  ReviveStamina,
  RushMove,
  SendEffectTrigger,
  ServerLuaCall,
  ServerMonsterLog,
  SetAIHitFeeling,
  SetAIParam,
  SetAISkillCDAvailableNow,
  SetAISkillCDMultiplier,
  SetAISkillGCD,
  SetAnimatorBool,
  SetAnimatorFloat,
  SetAnimatorInt,
  SetAnimatorTrigger,
  SetAvatarCanShakeOff,
  SetAvatarHitBuckets,
  SetCameraLockTime,
  SetCanDieImmediately,
  SetCombatFixedMovePoint,
  SetCrashDamage,
  SetCrystalShieldHpToOverrideMap,
  SetDvalinS01FlyState,
  SetEmissionScaler,
  SetEntityScale,
  SetExtraAbilityEnable,
  SetExtraAbilityState,
  SetGlobalDir,
  SetGlobalPos,
  SetGlobalValue,
  SetGlobalValueByTargetDistance,
  SetGlobalValueList,
  SetGlobalValueToOverrideMap,
  SetKeepInAirVelocityForce,
  SetNeuronEnable,
  SetNeuronMute,
  SetOverrideMapValue,
  SetPaimonLookAtAvatar,
  SetPaimonLookAtCamera,
  SetPaimonTempOffset,
  SetPartControlTarget,
  SetPoseBool,
  SetPoseFloat,
  SetPoseInt,
  SetRandomOverrideMapValue,
  SetSelfAttackTarget,
  SetSkillAnchor,
  SetSurroundAnchor,
  SetSystemValueToOverrideMap,
  SetVelocityIgnoreAirGY,
  SetWeaponAttachPointRealName,
  SetWeaponBindState,
  ShowExtraAbility,
  ShowProgressBarAction,
  ShowReminder,
  ShowScreenEffect,
  ShowUICombatBar,
  SpawnAttach,
  StartDither,
  Summon,
  SumTargetWeightToSelfGlobalValue,
  SyncEntityPositionByNormalizedTime,
  SyncToStageScript,
  ToNearstAnchorPoint,
  TriggerAbility,
  TriggerAttackEvent,
  TriggerAttackTargetMapEvent,
  TriggerAudio,
  TriggerAuxWeaponTrans,
  TriggerBullet,
  TriggerCreateGadgetToEquipPart,
  TriggerDropEquipParts,
  TriggerFaceAnimation,
  TriggerGadgetInteractive,
  TriggerHideWeapon,
  TriggerPlayerDie,
  TriggerSetCastShadow,
  TriggerSetChestLock,
  TriggerSetPassThrough,
  TriggerSetRenderersEnable,
  TriggerSetVisible,
  TriggerTaunt,
  TriggerThrowEquipPart,
  TryFindBlinkPoint,
  TryFindBlinkPointByBorn,
  TryTriggerPlatformStartMove,
  TurnDirection,
  TurnDirectionToPos,
  UnlockSkill,
  UpdateReactionDamage,
  UpdateUidValue,
  UseItem,
  UseSkillEliteSet,
  UtilityAction,
} from "./Child"

type ConfigAbilityAction =
  | ActCameraRadialBlur
  | ActCameraShake
  | ActTimeSlow
  | AddAvatarSkillInfo
  | AddClimateMeter
  | AddElementDurability
  | AddGlobalPos
  | AddGlobalValue
  | AddGlobalValueToTarget
  | AddServerBuff
  | ApplyLevelModifier
  | ApplyModifier
  | AttachAbilityStateResistance
  | AttachBulletAimPoint
  | AttachEffect
  | AttachElementTypeResistance
  | AttachLight
  | AttachModifier
  | AvatarCameraParam
  | AvatarDoBlink
  | AvatarEnterCameraShot
  | AvatarEnterFocus
  | AvatarExitCameraShot
  | AvatarExitClimb
  | AvatarExitFocus
  | AvatarSkillStart
  | BanEntityMark
  | BroadcastNeuronStimulate
  | CalcDvalinS04RebornPoint
  | CallLuaTask
  | ChangeEnviroWeather
  | ChangeFollowDampTime
  | ChangeGadgetUIInteractHint
  | ChangePlayMode
  | ChangeTag
  | ClearEndura
  | ClearGlobalPos
  | ClearGlobalValue
  | ClearLockTarget
  | ClearPos
  | ControlEmotion
  | CopyGlobalValue
  | CreateEntity
  | DamageByAttackValue
  | DebugLog
  | DoBlink
  | DoTileAction
  | DoWatcherSystemAction
  | DoWidgetSystemAction
  | DropSubfield
  | DummyAction
  | DungeonFogEffects
  | EnableAfterImage
  | EnableAIStealthy
  | EnableAvatarFlyStateTrail
  | EnableBulletCollisionPluginTrigger
  | EnableCameraDof
  | EnableCrashDamage
  | EnableGadgetIntee
  | EnableHeadControl
  | EnableHitAutoRedirect
  | EnableHitBoxByName
  | EnableMainInterface
  | EnableMonsterMoveOnWater
  | EnablePartControl
  | EnablePositionSynchronization
  | EnablePushColliderName
  | EnableRocketJump
  | EnableSceneTransformByName
  | EnableWetElectricHitBox
  | EnterCameraLock
  | EntityDoSkill
  | EquipAffixStart
  | ExecuteGadgetLua
  | ExecuteGroupTrigger
  | FireAISoundEvent
  | FireAudio
  | FireEffect
  | FireEffectForStorm
  | FireEffectToTarget
  | FireGainCrystalSeedEvent
  | FireHitEffect
  | FireMonsterBeingHitAfterImage
  | FireSubEmitterEffect
  | FireUIEffect
  | FixedAvatarRushMove
  | FixedMonsterRushMove
  | ForceAirStateFly
  | ForceInitMassiveEntity
  | ForceTriggerJump
  | ForceUseSkillSuccess
  | GenerateElemBall
  | GetPos
  | GuidePaimonDisappearEnd
  | HealHP
  | HealSP
  | HideUIBillBoard
  | IssueCommand
  | KillGadget
  | KillPlayEntity
  | KillSelf
  | LoseHP
  | ModifyAvatarSkillCD
  | MultiplyGlobalValue
  | PaimonAction
  | PlayEmojiBubble
  | PlayEmoSync
  | PushDvalinS01Process
  | PushPos
  | Randomed
  | RegisterAIActionPoint
  | RegistToStageScript
  | ReleaseAIActionPoint
  | RemoveAvatarSkillInfo
  | RemoveModifier
  | RemoveServerBuff
  | RemoveUniqueModifier
  | RemoveVelocityForce
  | Repeated
  | ResetAbilitySpecial
  | ResetAIAttackTarget
  | ResetAIResistTauntLevel
  | ResetAIThreatBroadcastRange
  | ResetAnimatorTrigger
  | ResetAvatarHitBuckets
  | ResetClimateMeter
  | ResetEnviroEular
  | ReTriggerAISkillInitialCD
  | ReviveAvatar
  | ReviveDeadAvatar
  | ReviveElemEnergy
  | ReviveStamina
  | RushMove
  | SendEffectTrigger
  | ServerLuaCall
  | ServerMonsterLog
  | SetAIHitFeeling
  | SetAIParam
  | SetAISkillCDAvailableNow
  | SetAISkillCDMultiplier
  | SetAISkillGCD
  | SetAnimatorBool
  | SetAnimatorFloat
  | SetAnimatorInt
  | SetAnimatorTrigger
  | SetAvatarCanShakeOff
  | SetAvatarHitBuckets
  | SetCameraLockTime
  | SetCanDieImmediately
  | SetCombatFixedMovePoint
  | SetCrashDamage
  | SetCrystalShieldHpToOverrideMap
  | SetDvalinS01FlyState
  | SetEmissionScaler
  | SetEntityScale
  | SetExtraAbilityEnable
  | SetExtraAbilityState
  | SetGlobalDir
  | SetGlobalPos
  | SetGlobalValue
  | SetGlobalValueByTargetDistance
  | SetGlobalValueList
  | SetGlobalValueToOverrideMap
  | SetKeepInAirVelocityForce
  | SetNeuronEnable
  | SetNeuronMute
  | SetOverrideMapValue
  | SetPaimonLookAtAvatar
  | SetPaimonLookAtCamera
  | SetPaimonTempOffset
  | SetPartControlTarget
  | SetPoseBool
  | SetPoseFloat
  | SetPoseInt
  | SetRandomOverrideMapValue
  | SetSelfAttackTarget
  | SetSkillAnchor
  | SetSurroundAnchor
  | SetSystemValueToOverrideMap
  | SetVelocityIgnoreAirGY
  | SetWeaponAttachPointRealName
  | SetWeaponBindState
  | ShowExtraAbility
  | ShowProgressBarAction
  | ShowReminder
  | ShowScreenEffect
  | ShowUICombatBar
  | SpawnAttach
  | StartDither
  | Summon
  | SumTargetWeightToSelfGlobalValue
  | SyncEntityPositionByNormalizedTime
  | SyncToStageScript
  | ToNearstAnchorPoint
  | TriggerAbility
  | TriggerAttackEvent
  | TriggerAttackTargetMapEvent
  | TriggerAudio
  | TriggerAuxWeaponTrans
  | TriggerBullet
  | TriggerCreateGadgetToEquipPart
  | TriggerDropEquipParts
  | TriggerFaceAnimation
  | TriggerGadgetInteractive
  | TriggerHideWeapon
  | TriggerPlayerDie
  | TriggerSetCastShadow
  | TriggerSetChestLock
  | TriggerSetPassThrough
  | TriggerSetRenderersEnable
  | TriggerSetVisible
  | TriggerTaunt
  | TriggerThrowEquipPart
  | TryFindBlinkPoint
  | TryFindBlinkPointByBorn
  | TryTriggerPlatformStartMove
  | TurnDirection
  | TurnDirectionToPos
  | UnlockSkill
  | UpdateReactionDamage
  | UpdateUidValue
  | UseItem
  | UseSkillEliteSet
  | UtilityAction

export default ConfigAbilityAction
