import AppliedAbility from "./appliedAbility"

import BaseClass from "#/baseClass"
import { PacketContext } from "#/packet"
import Entity from "$/entity"
import Avatar from "$/entity/avatar"
import Gadget from "$/entity/gadget"
import AbilityData from "$/gameData/data/AbilityData"
import AbilityManager from "$/manager/abilityManager"
import Vector from "$/utils/vector"
import ConfigAbilityAction from "$DT/BinOutput/Config/ConfigAbility/Action"
import {
  AvatarSkillStart,
  ChangeGadgetState,
  DebugLog,
  ExecuteGadgetLua,
  GenerateElemBall,
  HealHP,
  LoseHP,
  ReviveAvatar,
  ReviveDeadAvatar,
  TriggerAbility,
} from "$DT/BinOutput/Config/ConfigAbility/Action/Child"
import ConfigAbilityMixin from "$DT/BinOutput/Config/ConfigAbility/Mixin"
import { CostStaminaMixin } from "$DT/BinOutput/Config/ConfigAbility/Mixin/Child"
import Logger from "@/logger"
import { EntityTypeEnum, FightPropEnum, GadgetStateEnum } from "@/types/enum"
import { AbilityActionGenerateElemBall } from "@/types/proto"
import { ChangeHpReasonEnum, PlayerDieTypeEnum, ProtEntityTypeEnum } from "@/types/proto/enum"
import { getStringHash } from "@/utils/hash"

const MathOp = ["MUL", "ADD"]
const creatureTypes = [EntityTypeEnum.Avatar, EntityTypeEnum.Monster]

const logger = new Logger("ABIACT", 0xcbf542)

export default class AbilityAction extends BaseClass {
  manager: AbilityManager

  constructor(manager: AbilityManager) {
    super()

    this.manager = manager

    super.initHandlers(this)
  }

  async runActionConfig(
    context: PacketContext,
    ability: AppliedAbility,
    config: ConfigAbilityAction | ConfigAbilityMixin,
    param: object,
    target: Entity
  ) {
    if (ability == null || config == null) return

    logger.debug("RunAction:", config?.$type, config, param, target.entityId)
    await this.emit(config?.$type, context, ability, config, param, target)
  }

  /**Actions Events**/

  // ActCameraRadialBlur

  // ActCameraShake

  // ActTimeSlow

  // AddAvatarSkillInfo

  // AddClimateMeter

  // AddElementDurability

  // AddGlobalPos

  // AddGlobalValue

  // AddGlobalValueToTarget

  // AddServerBuff

  // ApplyLevelModifier

  // ApplyModifier

  // AttachAbilityStateResistance

  // AttachBulletAimPoint

  // AttachEffect

  // AttachElementTypeResistance

  // AttachLight

  // AttachModifier

  // AvatarCameraParam

  // AvatarDoBlink

  // AvatarEnterCameraShot

  // AvatarEnterFocus

  // AvatarExitCameraShot

  // AvatarExitClimb

  // AvatarExitFocus

  // AvatarSkillStart
  async handleAvatarSkillStart(context: PacketContext, ability: AppliedAbility, config: AvatarSkillStart) {
    const { manager } = this
    const { entity, utils } = manager
    const { skillManager } = <Avatar>entity
    const { currentDepot } = skillManager
    const { SkillID, CostStaminaRatio, CdRatio } = config

    await currentDepot
      ?.getSkill(SkillID)
      ?.start(context, utils.eval(ability, CdRatio, 1), utils.eval(ability, CostStaminaRatio, 1))
  }

  // BanEntityMark

  // BroadcastNeuronStimulate

  // CalcDvalinS04RebornPoint

  // CallLuaTask

  // ChangeEnviroWeather

  // ChangeFollowDampTime

  // ChangeGadgetUIInteractHint

  // ChangeGadgetState
  async handleChangeGadgetState(_context: PacketContext, _ability: AppliedAbility, config: ChangeGadgetState) {
    const { manager } = this
    const { entity } = manager

    await (<Gadget>entity).setGadgetState(config.State || GadgetStateEnum.Default)
  }

  // ChangePlayMode

  // ChangeTag

  // ClearEndura

  // ClearGlobalPos

  // ClearGlobalValue

  // ClearLockTarget

  // ClearPos

  // ControlEmotion

  // CopyGlobalValue

  // CreateEntity

  // DamageByAttackValue

  // DebugLog
  async handleDebugLog(_context: PacketContext, ability: AppliedAbility, config: DebugLog) {
    const { abilityName } = ability
    const { Content } = config
    logger.debug(await AbilityData.lookupString(abilityName), Content)
  }

  // DoBlink

  // DoTileAction

  // DoWatcherSystemAction

  // DoWidgetSystemAction

  // DropSubfield

  // DummyAction

  // DungeonFogEffects

  // EnableAfterImage

  // EnableAIStealthy

  // EnableAvatarFlyStateTrail

  // EnableBulletCollisionPluginTrigger

  // EnableCameraDof

  // EnableCrashDamage

  // EnableGadgetIntee

  // EnableHeadControl

  // EnableHitAutoRedirect

  // EnableHitBoxByName

  // EnableMainInterface

  // EnableMonsterMoveOnWater

  // EnablePartControl

  // EnablePositionSynchronization

  // EnablePushColliderName

  // EnableRocketJump

  // EnableSceneTransformByName

  // EnableWetElectricHitBox

  // EnterCameraLock

  // EntityDoSkill

  // EquipAffixStart

  // ExecuteGadgetLua
  async handleExecuteGadgetLua(_context: PacketContext, _ability: AppliedAbility, config: ExecuteGadgetLua) {
    const { manager } = this
    const { entity } = manager

    if (entity.protEntityType !== ProtEntityTypeEnum.PROT_ENTITY_GADGET) return

    await (<Gadget>entity).setGadgetState(config.Param1 || GadgetStateEnum.Default)
  }

  // ExecuteGroupTrigger

  // FireAISoundEvent

  // FireAudio

  // FireEffect

  // FireEffectForStorm

  // FireEffectToTarget

  // FireGainCrystalSeedEvent

  // FireHitEffect

  // FireMonsterBeingHitAfterImage

  // FireSubEmitterEffect

  // FireUIEffect

  // FixedAvatarRushMove

  // FixedMonsterRushMove

  // ForceAirStateFly

  // ForceInitMassiveEntity

  // ForceTriggerJump

  // ForceUseSkillSuccess

  // GenerateElemBall
  async handleGenerateElemBall(
    context: PacketContext,
    ability: AppliedAbility,
    config: GenerateElemBall,
    param: AbilityActionGenerateElemBall
  ) {
    const { manager } = this
    const { entity, utils } = manager
    const { player } = <Avatar>entity
    if (!player) return

    const { energyManager } = player
    const { seqId } = context
    const { ConfigID, Ratio, BaseEnergy } = config
    const { pos } = param

    if (ConfigID == null) return

    await energyManager.spawnDrop(
      new Vector().setData(pos),
      ConfigID,
      Math.floor(BaseEnergy * utils.eval(ability, Ratio || 1)),
      seqId
    )
  }

  // GetPos

  // GuidePaimonDisappearEnd

  // HealHP
  async handleHealHP(context: PacketContext, ability: AppliedAbility, config: HealHP, _param: object, target: Entity) {
    const { manager } = this
    const { utils, predicate } = manager

    const targetList = utils.getTargetList(ability, config, target)
    for (const targetEntity of targetList) {
      if (!predicate.checkAll(ability, config.Predicates, targetEntity)) continue
      const amount = utils.calcAmount(ability, utils.getCaster(), targetEntity, config)
      await targetEntity.heal(amount, true, ChangeHpReasonEnum.CHANGE_HP_ADD_ABILITY, context.seqId)
    }
  }

  // HealSP

  // HideUIBillBoard

  // IssueCommand

  // KillGadget

  // KillPlayEntity

  // KillSelf
  async handleKillSelf() {
    const { manager } = this
    const { entity } = manager

    await entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE)
  }

  // LoseHP
  async handleLoseHP(context: PacketContext, ability: AppliedAbility, config: LoseHP, _param: object, target: Entity) {
    const { manager } = this
    const { utils } = manager
    const { Lethal } = config

    const targetList = utils.getTargetList(ability, config, target)

    for (const targetEntity of targetList) {
      const amount = utils.calcAmount(ability, utils.getCaster(), targetEntity, config)
      if (targetEntity.getProp(FightPropEnum.FIGHT_PROP_CUR_HP) - amount <= 0 && !Lethal) continue

      await targetEntity.takeDamage(null, amount, true, ChangeHpReasonEnum.CHANGE_HP_SUB_ABILITY, context.seqId)
    }
  }

  // ModifyAvatarSkillCD

  // MultiplyGlobalValue

  // PaimonAction

  // PlayEmojiBubble

  // PlayEmoSync

  // PushDvalinS01Process

  // PushPos

  // Randomed

  // RegisterAIActionPoint

  // RegistToStageScript

  // ReleaseAIActionPoint

  // RemoveAvatarSkillInfo

  // RemoveModifier

  // RemoveServerBuff

  // RemoveUniqueModifier

  // RemoveVelocityForce

  // Repeated

  // ResetAbilitySpecial

  // ResetAIAttackTarget

  // ResetAIResistTauntLevel

  // ResetAIThreatBroadcastRange

  // ResetAnimatorTrigger

  // ResetAvatarHitBuckets

  // ResetClimateMeter

  // ResetEnviroEular

  // ReTriggerAISkillInitialCD

  // ReviveAvatar
  async handleReviveAvatar(
    _context: PacketContext,
    ability: AppliedAbility,
    config: ReviveAvatar,
    _param: object,
    target: Entity
  ) {
    const { manager } = this
    const { utils } = manager

    const targetList = utils.getTargetList(ability, config, target)
    for (const targetEntity of targetList) {
      if (!targetEntity.isDead()) continue

      const amount = utils.calcAmount(ability, utils.getCaster(), targetEntity, config)
      await targetEntity.revive(amount)
    }
  }

  // ReviveDeadAvatar
  async handleReviveDeadAvatar(
    context: PacketContext,
    ability: AppliedAbility,
    config: ReviveDeadAvatar,
    _param: object
  ) {
    const { manager } = this
    const { entity, utils } = manager
    const { player, skillManager } = <Avatar>entity
    if (!player) return

    const { teamManager, currentScene } = player
    if (!currentScene) return

    const { currentDepot } = skillManager
    const { playerList } = currentScene
    const { SkillID, CdRatio, IsReviveOtherPlayerAvatar, Range } = config

    await currentDepot?.getSkill(SkillID)?.start(context, utils.eval(ability, CdRatio, 1))

    const avatarList: Avatar[] = []
    if (IsReviveOtherPlayerAvatar) {
      for (const p of playerList) {
        if (p === player) continue
        avatarList.push(...p.teamManager.getTeam().getAvatarList())
      }
    } else {
      avatarList.push(...teamManager.getTeam().getAvatarList())
    }

    const range = Range || 40
    for (const avatar of avatarList) {
      const distance = avatar.player.currentAvatar.distanceTo(entity)
      if (!avatar.isDead() || distance > range) continue

      const amount = utils.calcAmount(ability, utils.getCaster(), avatar, config)
      await avatar.revive(amount)
    }
  }

  // ReviveElemEnergy

  // ReviveStamina

  // RushMove

  // SendEffectTrigger

  // ServerLuaCall

  // ServerMonsterLog

  // SetAIHitFeeling

  // SetAIParam

  // SetAISkillCDAvailableNow

  // SetAISkillCDMultiplier

  // SetAISkillGCD

  // SetAnimatorBool

  // SetAnimatorFloat

  // SetAnimatorInt

  // SetAnimatorTrigger

  // SetAvatarCanShakeOff

  // SetAvatarHitBuckets

  // SetCameraLockTime

  // SetCanDieImmediately

  // SetCombatFixedMovePoint

  // SetCrashDamage

  // SetCrystalShieldHpToOverrideMap

  // SetDvalinS01FlyState

  // SetEmissionScaler

  // SetEntityScale

  // SetExtraAbilityEnable

  // SetExtraAbilityState

  // SetGlobalDir

  // SetGlobalPos

  // SetGlobalValue

  // SetGlobalValueByTargetDistance

  // SetGlobalValueList

  // SetGlobalValueToOverrideMap

  // SetKeepInAirVelocityForce

  // SetNeuronEnable

  // SetNeuronMute

  // SetOverrideMapValue

  // SetPaimonLookAtAvatar

  // SetPaimonLookAtCamera

  // SetPaimonTempOffset

  // SetPartControlTarget

  // SetPoseBool

  // SetPoseFloat

  // SetPoseInt

  // SetRandomOverrideMapValue

  // SetSelfAttackTarget

  // SetSkillAnchor

  // SetSurroundAnchor

  // SetSystemValueToOverrideMap

  // SetVelocityIgnoreAirGY

  // SetWeaponAttachPointRealName

  // SetWeaponBindState

  // ShowExtraAbility

  // ShowProgressBarAction

  // ShowReminder

  // ShowScreenEffect

  // ShowUICombatBar

  // SpawnAttach

  // StartDither

  // Summon

  // SumTargetWeightToSelfGlobalValue

  // SyncEntityPositionByNormalizedTime

  // SyncToStageScript

  // ToNearstAnchorPoint

  // TriggerAbility
  async handleTriggerAbility(
    context: PacketContext,
    ability: AppliedAbility,
    config: TriggerAbility,
    _param: object,
    target: Entity
  ) {
    const { manager } = this
    const { predicate } = manager
    const { Predicates, AbilityName } = config

    if (!predicate.checkAll(ability, Predicates, target)) return

    await manager.triggerAbility(context, { hash: getStringHash(AbilityName) })
  }

  // TriggerAttackEvent

  // TriggerAttackTargetMapEvent

  // TriggerAudio

  // TriggerAuxWeaponTrans

  // TriggerBullet

  // TriggerCreateGadgetToEquipPart

  // TriggerDropEquipParts

  // TriggerFaceAnimation

  // TriggerGadgetInteractive

  // TriggerHideWeapon

  // TriggerPlayerDie

  // TriggerSetCastShadow

  // TriggerSetChestLock

  // TriggerSetPassThrough

  // TriggerSetRenderersEnable

  // TriggerSetVisible

  // TriggerTaunt

  // TriggerThrowEquipPart

  // TryFindBlinkPoint

  // TryFindBlinkPointByBorn

  // TryTriggerPlatformStartMove

  // TurnDirection

  // TurnDirectionToPos

  // UnlockSkill

  // UpdateReactionDamage

  // UpdateUidValue

  // UseItem

  // UseSkillEliteSet

  // UtilityAction

  /**Mixin Events**/

  // AirFlowMixin

  // AnimatorRotationCompensateMixin

  // ApplyInertiaVelocityMixin

  // ApplyModifierWithSharedDurabilityMixin

  // AttachModifierByStackingMixin

  // AttachModifierToElementDurabilityMixin

  // AttachModifierToHPPercentMixin

  // AttachModifierToPredicateMixin

  // AttachModifierToSelfGlobalValueMixin

  // AttachModifierToTargetDistanceMixin

  // AttachToAbilityStateMixin

  // AttachToAIAlertnessMixin

  // AttachToAnimatorStateIDMixin

  // AttachToDayNightMixin

  // AttachToElementTypeMixin

  // AttachToGadgetStateMixin

  // AttachToGadgetStateMutexMixin

  // AttachToMonsterAirStateMixin

  // AttachToNormalizedTimeMixin

  // AttachToPlayStageMixin

  // AttachToPoseIDMixin

  // AttachToStateIDMixin

  // AttackCostElementMixin

  // AttackHittingSceneMixin

  // AvatarChangeSkillMixin

  // AvatarLevelSkillMixin

  // AvatarLockForwardFlyMixin

  // AvatarSteerByCameraMixin

  // BanEntityMarkMixin

  // BeingHitMixin

  // BillboardMarkMixin

  // BoxClampWindZoneMixin

  // ButtonHoldChargeMixin

  // CameraBlurMixin

  // CameraLockMixin

  // ChangeFieldMixin

  // ChangePropTypeValueMixin

  // ChargeBarMixin

  // CircleBarrageMixin

  // ClusterTriggerMixin

  // CollisionMixin

  // CostStaminaMixin
  async handleCostStaminaMixin(_context: PacketContext, ability: AppliedAbility, config: CostStaminaMixin) {
    const { manager } = this
    const { entity, utils } = manager
    const { staminaManager } = <Avatar>entity
    const { CostStaminaDelta } = config

    if (staminaManager == null) return

    staminaManager.immediate(utils.eval(ability, CostStaminaDelta || 1) * 30)
  }

  // CurLocalAvatarMixin

  // DebugMixin

  // DoActionByAnimatorStateIDMixin

  // DoActionByCreateGadgetMixin

  // DoActionByElementReactionMixin

  // DoActionByEnergyChangeMixin

  // DoActionByEventMixin

  // DoActionByGainCrystalSeedMixin

  // DoActionByKillingMixin

  // DoActionByPoseIDMixin

  // DoActionByStateIDMixin

  // DoActionByTeamStatusMixin

  // DoReviveMixin

  // DoTileActionManagerMixin

  // DummyMixin

  // DvalinS01BoxMoxeMixin

  // DvalinS01PathEffsMixin

  // ElementAdjustMixin

  // ElementHittingOtherPredicatedMixin

  // ElementOuterGlowEffectMixin

  // ElementReactionShockMixin

  // ElementShieldMixin

  // EliteShieldMixin

  // EntityDefenceMixin

  // EntityDitherMixin

  // EntityInVisibleMixin

  // EntityMarkShowTypeMixin

  // EnviroFollowRotateMixin

  // ExtendLifetimeByPickedGadgetMixin

  // FieldEntityCountChangeMixin

  // FixDvalinS04MoveMixin

  // GlobalMainShieldMixin

  // GlobalSubShieldMixin

  // HitLevelGaugeMixin

  // HomeworldEnterEditorMixin

  // IceFloorMixin

  // ModifyDamageMixin

  // ModifyElementDecrateMixin

  // ModifySkillCDByModifierCountMixin

  // MonsterReadyMixin

  // MoveStateMixin

  // OnAvatarUseSkillMixin

  // OverrideAttackEventMixin

  // OverrideStickElemUIMixin

  // PlayerUidNotifyMixin

  // RecycleModifierMixin

  // RejectAttackMixin

  // RelyOnElementMixin

  // ReplaceEventPatternMixin

  // ResistClimateMixin

  // ReviveElemEnergyMixin

  // ScenePropSyncMixin

  // ServerCreateGadgetOnKillMixin

  // ServerFinishWatcherMixin

  // ServerUpdateGlobalValueMixin

  // SetSkillCanUseInStateMixin

  // ShaderLerpMixin

  // ShieldBarMixin

  // SkillButtonHoldChargeMixin

  // StageReadyMixin

  // SteerAttackMixin

  // SwitchSkillIDMixin

  // TDPlayMixin

  // TileAttackManagerMixin

  // TileAttackMixin

  // TileComplexManagerMixin

  // TileComplexMixin

  // TornadoMixin

  // TriggerPostProcessEffectMixin

  // TriggerResistDamageTextMixin

  // TriggerTypeSupportMixin

  // TriggerWeatherMixin

  // TriggerWitchTimeMixin

  // UrgentHotFixMixin

  // VelocityDetectMixin

  // VelocityForceMixin

  // WatcherSystemMixin

  // WeightDetectRegionMixin

  // WindSeedSpawnerMixin

  // WindZoneMixin
}
