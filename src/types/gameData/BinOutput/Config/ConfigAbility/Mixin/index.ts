import {
  AirFlowMixin,
  AnimatorRotationCompensateMixin,
  ApplyInertiaVelocityMixin,
  ApplyModifierWithSharedDurabilityMixin,
  AttachModifierByStackingMixin,
  AttachModifierToElementDurabilityMixin,
  AttachModifierToHPPercentMixin,
  AttachModifierToPredicateMixin,
  AttachModifierToSelfGlobalValueMixin,
  AttachModifierToTargetDistanceMixin,
  AttachToAbilityStateMixin,
  AttachToAIAlertnessMixin,
  AttachToAnimatorStateIDMixin,
  AttachToDayNightMixin,
  AttachToElementTypeMixin,
  AttachToGadgetStateMixin,
  AttachToGadgetStateMutexMixin,
  AttachToMonsterAirStateMixin,
  AttachToNormalizedTimeMixin,
  AttachToPlayStageMixin,
  AttachToPoseIDMixin,
  AttachToStateIDMixin,
  AttackCostElementMixin,
  AttackHittingSceneMixin,
  AvatarChangeSkillMixin,
  AvatarLevelSkillMixin,
  AvatarLockForwardFlyMixin,
  AvatarSteerByCameraMixin,
  BanEntityMarkMixin,
  BeingHitMixin,
  BillboardMarkMixin,
  BoxClampWindZoneMixin,
  ButtonHoldChargeMixin,
  CameraBlurMixin,
  CameraLockMixin,
  ChangeFieldMixin,
  ChangePropTypeValueMixin,
  ChargeBarMixin,
  CircleBarrageMixin,
  ClusterTriggerMixin,
  CollisionMixin,
  CostStaminaMixin,
  CurLocalAvatarMixin,
  DebugMixin,
  DoActionByAnimatorStateIDMixin,
  DoActionByCreateGadgetMixin,
  DoActionByElementReactionMixin,
  DoActionByEnergyChangeMixin,
  DoActionByEventMixin,
  DoActionByGainCrystalSeedMixin,
  DoActionByKillingMixin,
  DoActionByPoseIDMixin,
  DoActionByStateIDMixin,
  DoActionByTeamStatusMixin,
  DoReviveMixin,
  DoTileActionManagerMixin,
  DummyMixin,
  DvalinS01BoxMoxeMixin,
  DvalinS01PathEffsMixin,
  ElementAdjustMixin,
  ElementHittingOtherPredicatedMixin,
  ElementOuterGlowEffectMixin,
  ElementReactionShockMixin,
  ElementShieldMixin,
  EliteShieldMixin,
  EntityDefenceMixin,
  EntityDitherMixin,
  EntityInVisibleMixin,
  EntityMarkShowTypeMixin,
  EnviroFollowRotateMixin,
  ExtendLifetimeByPickedGadgetMixin,
  FieldEntityCountChangeMixin,
  FixDvalinS04MoveMixin,
  GlobalMainShieldMixin,
  GlobalSubShieldMixin,
  HitLevelGaugeMixin,
  HomeworldEnterEditorMixin,
  IceFloorMixin,
  ModifyDamageMixin,
  ModifyElementDecrateMixin,
  ModifySkillCDByModifierCountMixin,
  MonsterReadyMixin,
  MoveStateMixin,
  OnAvatarUseSkillMixin,
  OverrideAttackEventMixin,
  OverrideStickElemUIMixin,
  PlayerUidNotifyMixin,
  RecycleModifierMixin,
  RejectAttackMixin,
  RelyOnElementMixin,
  ReplaceEventPatternMixin,
  ResistClimateMixin,
  ReviveElemEnergyMixin,
  ScenePropSyncMixin,
  ServerCreateGadgetOnKillMixin,
  ServerFinishWatcherMixin,
  ServerUpdateGlobalValueMixin,
  SetSkillCanUseInStateMixin,
  ShaderLerpMixin,
  ShieldBarMixin,
  SkillButtonHoldChargeMixin,
  StageReadyMixin,
  SteerAttackMixin,
  SwitchSkillIDMixin,
  TDPlayMixin,
  TileAttackManagerMixin,
  TileAttackMixin,
  TileComplexManagerMixin,
  TileComplexMixin,
  TornadoMixin,
  TriggerPostProcessEffectMixin,
  TriggerResistDamageTextMixin,
  TriggerTypeSupportMixin,
  TriggerWeatherMixin,
  TriggerWitchTimeMixin,
  UrgentHotFixMixin,
  VelocityDetectMixin,
  VelocityForceMixin,
  WatcherSystemMixin,
  WeightDetectRegionMixin,
  WindSeedSpawnerMixin,
  WindZoneMixin,
} from "./Child"

type ConfigAbilityMixin =
  | AirFlowMixin
  | AnimatorRotationCompensateMixin
  | ApplyInertiaVelocityMixin
  | ApplyModifierWithSharedDurabilityMixin
  | AttachModifierByStackingMixin
  | AttachModifierToElementDurabilityMixin
  | AttachModifierToHPPercentMixin
  | AttachModifierToPredicateMixin
  | AttachModifierToSelfGlobalValueMixin
  | AttachModifierToTargetDistanceMixin
  | AttachToAbilityStateMixin
  | AttachToAIAlertnessMixin
  | AttachToAnimatorStateIDMixin
  | AttachToDayNightMixin
  | AttachToElementTypeMixin
  | AttachToGadgetStateMixin
  | AttachToGadgetStateMutexMixin
  | AttachToMonsterAirStateMixin
  | AttachToNormalizedTimeMixin
  | AttachToPlayStageMixin
  | AttachToPoseIDMixin
  | AttachToStateIDMixin
  | AttackCostElementMixin
  | AttackHittingSceneMixin
  | AvatarChangeSkillMixin
  | AvatarLevelSkillMixin
  | AvatarLockForwardFlyMixin
  | AvatarSteerByCameraMixin
  | BanEntityMarkMixin
  | BeingHitMixin
  | BillboardMarkMixin
  | BoxClampWindZoneMixin
  | ButtonHoldChargeMixin
  | CameraBlurMixin
  | CameraLockMixin
  | ChangeFieldMixin
  | ChangePropTypeValueMixin
  | ChargeBarMixin
  | CircleBarrageMixin
  | ClusterTriggerMixin
  | CollisionMixin
  | CostStaminaMixin
  | CurLocalAvatarMixin
  | DebugMixin
  | DoActionByAnimatorStateIDMixin
  | DoActionByCreateGadgetMixin
  | DoActionByElementReactionMixin
  | DoActionByEnergyChangeMixin
  | DoActionByEventMixin
  | DoActionByGainCrystalSeedMixin
  | DoActionByKillingMixin
  | DoActionByPoseIDMixin
  | DoActionByStateIDMixin
  | DoActionByTeamStatusMixin
  | DoReviveMixin
  | DoTileActionManagerMixin
  | DummyMixin
  | DvalinS01BoxMoxeMixin
  | DvalinS01PathEffsMixin
  | ElementAdjustMixin
  | ElementHittingOtherPredicatedMixin
  | ElementOuterGlowEffectMixin
  | ElementReactionShockMixin
  | ElementShieldMixin
  | EliteShieldMixin
  | EntityDefenceMixin
  | EntityDitherMixin
  | EntityInVisibleMixin
  | EntityMarkShowTypeMixin
  | EnviroFollowRotateMixin
  | ExtendLifetimeByPickedGadgetMixin
  | FieldEntityCountChangeMixin
  | FixDvalinS04MoveMixin
  | GlobalMainShieldMixin
  | GlobalSubShieldMixin
  | HitLevelGaugeMixin
  | HomeworldEnterEditorMixin
  | IceFloorMixin
  | ModifyDamageMixin
  | ModifyElementDecrateMixin
  | ModifySkillCDByModifierCountMixin
  | MonsterReadyMixin
  | MoveStateMixin
  | OnAvatarUseSkillMixin
  | OverrideAttackEventMixin
  | OverrideStickElemUIMixin
  | PlayerUidNotifyMixin
  | RecycleModifierMixin
  | RejectAttackMixin
  | RelyOnElementMixin
  | ReplaceEventPatternMixin
  | ResistClimateMixin
  | ReviveElemEnergyMixin
  | ScenePropSyncMixin
  | ServerCreateGadgetOnKillMixin
  | ServerFinishWatcherMixin
  | ServerUpdateGlobalValueMixin
  | SetSkillCanUseInStateMixin
  | ShaderLerpMixin
  | ShieldBarMixin
  | SkillButtonHoldChargeMixin
  | StageReadyMixin
  | SteerAttackMixin
  | SwitchSkillIDMixin
  | TDPlayMixin
  | TileAttackManagerMixin
  | TileAttackMixin
  | TileComplexManagerMixin
  | TileComplexMixin
  | TornadoMixin
  | TriggerPostProcessEffectMixin
  | TriggerResistDamageTextMixin
  | TriggerTypeSupportMixin
  | TriggerWeatherMixin
  | TriggerWitchTimeMixin
  | UrgentHotFixMixin
  | VelocityDetectMixin
  | VelocityForceMixin
  | WatcherSystemMixin
  | WeightDetectRegionMixin
  | WindSeedSpawnerMixin
  | WindZoneMixin

export default ConfigAbilityMixin
