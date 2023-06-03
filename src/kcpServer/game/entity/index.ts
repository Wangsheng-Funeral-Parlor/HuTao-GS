import Avatar from "./avatar"
import EntityProps from "./entityProps"
import FightProp, { FightPropChangeReason } from "./fightProps"
import Gadget from "./gadget"
import Monster from "./monster"
import Motion from "./motion"
import Npc from "./npc"

import BaseClass from "#/baseClass"
import LifeStateChange from "#/packets/LifeStateChange"
import AbilityManager from "$/manager/abilityManager"
import EntityManager from "$/manager/entityManager"
import Vector from "$/utils/vector"
import ConfigEntityAbilityEntry from "$DT/BinOutput/Config/ConfigEntityAbilityEntry"
import ConfigGlobalValue from "$DT/BinOutput/Config/ConfigGlobalValue"
import { EntityTypeEnum, FightPropEnum, PlayerPropEnum } from "@/types/enum"
import { EntityFightPropConfig } from "@/types/game"
import { CurveExcelConfig } from "@/types/gameData/ExcelBinOutput/Common/CurveExcelConfig"
import { EntityAuthorityInfo, SceneEntityInfo } from "@/types/proto"
import {
  AbilityScalarTypeEnum,
  ChangeEnergyReasonEnum,
  ChangeHpReasonEnum,
  LifeStateEnum,
  PlayerDieTypeEnum,
  ProtEntityTypeEnum,
  VisionTypeEnum,
} from "@/types/proto/enum"
import EntityUserData from "@/types/user/EntityUserData"
import { getStringHash } from "@/utils/hash"

export default class Entity extends BaseClass {
  manager?: EntityManager

  avatar?: Avatar
  monster?: Monster
  npc?: Npc
  gadget?: Gadget

  entityId: number
  entityType: EntityTypeEnum
  protEntityType: ProtEntityTypeEnum

  name?: string

  groupId: number
  configId: number
  blockId: number

  config: EntityFightPropConfig
  growCurve: CurveExcelConfig[]

  abilityManager: AbilityManager
  props: EntityProps
  fightProps: FightProp
  motion: Motion

  authorityPeerId: number

  bornPos: Vector

  lifeState: LifeStateEnum
  isInvincible: boolean
  isLockHP: boolean
  godMode: boolean

  dieType: PlayerDieTypeEnum
  attackerId: number

  isOnScene: boolean
  gridHash: number

  constructor(offScene = false) {
    super()

    this.props = new EntityProps(this)
    this.fightProps = new FightProp(this)
    if (!offScene) {
      this.abilityManager = new AbilityManager(this)
      this.motion = new Motion(this)
      this.bornPos = new Vector()
    }

    this.groupId = 0
    this.configId = 0
    this.blockId = 0

    this.authorityPeerId = null

    this.lifeState = LifeStateEnum.LIFE_NONE
    this.isInvincible = false
    this.isLockHP = false
    this.godMode = false

    this.isOnScene = false
  }

  protected loadAbilities(abilities: ConfigEntityAbilityEntry[], init = false) {
    const { abilityManager } = this
    if (abilityManager == null || !Array.isArray(abilities)) return

    for (const ability of abilities) {
      abilityManager.addEmbryo(ability.AbilityName || undefined, ability.AbilityOverride || undefined)
    }

    if (init) abilityManager.initFromEmbryos()
  }

  protected loadGlobalValue(globalValue: ConfigGlobalValue) {
    const { abilityManager } = this
    if (abilityManager == null) return

    const { sgvDynamicValueMapContainer } = abilityManager
    if (sgvDynamicValueMapContainer == null) return

    const { ServerGlobalValues, InitServerGlobalValues } = globalValue || {}
    if (!Array.isArray(ServerGlobalValues)) return

    sgvDynamicValueMapContainer.setValues(
      ServerGlobalValues.map((name) => ({
        key: { hash: getStringHash(name), str: name },
        valueType: AbilityScalarTypeEnum.FLOAT,
        floatValue: InitServerGlobalValues?.[name] || 0,
      }))
    )
  }

  async init(userData: EntityUserData) {
    const { props, fightProps } = this
    const { lifeState, propsData, fightPropsData } = userData

    this.lifeState = typeof lifeState === "number" ? lifeState : LifeStateEnum.LIFE_ALIVE

    props.init(propsData)
    fightProps.init(fightPropsData)

    await fightProps.update()
  }

  async initNew(level = 1) {
    const { props, fightProps } = this

    this.lifeState = LifeStateEnum.LIFE_ALIVE

    props.initNew(level)

    await fightProps.update()
  }

  isAlive() {
    return this.lifeState === LifeStateEnum.LIFE_ALIVE
  }

  isDead() {
    return this.lifeState === LifeStateEnum.LIFE_DEAD
  }

  get level() {
    return this.props.get(PlayerPropEnum.PROP_LEVEL)
  }
  set level(v: number) {
    this.props.set(PlayerPropEnum.PROP_LEVEL, v)
  }

  get exp() {
    return this.props.get(PlayerPropEnum.PROP_EXP)
  }
  set exp(v: number) {
    this.props.set(PlayerPropEnum.PROP_EXP, v)
  }

  get promoteLevel() {
    return this.props.get(PlayerPropEnum.PROP_BREAK_LEVEL)
  }
  set promoteLevel(v: number) {
    this.props.set(PlayerPropEnum.PROP_BREAK_LEVEL, v)
  }

  get sceneBlock() {
    return this.manager?.scene.sceneBlockList.find((b) => b.id === this.blockId)
  }

  get sceneGroup() {
    return this.manager?.scene.sceneBlockList
      .find((b) => b.id === this.blockId)
      ?.groupList.find((g) => g.id === this.groupId)
  }

  distanceTo(entity: Entity) {
    return this.motion.distanceTo(entity.motion)
  }

  distanceTo2D(entity: Entity) {
    return this.motion.distanceTo2D(entity.motion)
  }

  gridEqual(grid: Vector) {
    return this.motion.pos.grid.equal(grid)
  }

  updateAuthorityPeer(): boolean {
    const { manager, entityId, protEntityType, authorityPeerId } = this
    const { world, playerList } = manager?.scene || {}

    if (
      protEntityType !== ProtEntityTypeEnum.PROT_ENTITY_MONSTER ||
      world?.getPeer(authorityPeerId)?.loadedEntityIdList?.includes(entityId)
    )
      return false

    const peerId = playerList?.find(
      (player) => !player.noAuthority && player.loadedEntityIdList.includes(entityId)
    )?.peerId
    if (peerId == null) return false

    this.authorityPeerId = peerId

    return authorityPeerId != null
  }

  getProp(type: FightPropEnum): number {
    return this.fightProps.get(type)
  }

  async setProp(
    type: FightPropEnum,
    val: number,
    notify?: boolean,
    changeReason?: FightPropChangeReason,
    seqId?: number
  ) {
    await this.fightProps.set(type, val, notify, changeReason, seqId)
  }

  async drainEnergy(notify = false, changeEnergyReason?: ChangeEnergyReasonEnum, seqId?: number): Promise<void> {
    if (this.godMode) return

    await this.fightProps.drainEnergy(notify, changeEnergyReason, seqId)
  }

  async gainEnergy(
    val: number,
    flat = false,
    notify = false,
    changeEnergyReason?: ChangeEnergyReasonEnum,
    seqId?: number
  ): Promise<void> {
    await this.fightProps.gainEnergy(val, flat, notify, changeEnergyReason, seqId)
  }

  async rechargeEnergy(notify = false, changeEnergyReason?: ChangeEnergyReasonEnum, seqId?: number): Promise<void> {
    await this.fightProps.rechargeEnergy(notify, changeEnergyReason, seqId)
  }

  async takeDamage(
    attackerId: number,
    val: number,
    notify = false,
    changeHpReason?: ChangeHpReasonEnum,
    seqId?: number
  ): Promise<void> {
    const { isInvincible, isLockHP, godMode } = this
    if (isInvincible || isLockHP || godMode || !this.isAlive()) return

    const killed = await this.fightProps.takeDamage(val, notify, changeHpReason, seqId)
    if (!killed) return

    let dieType: PlayerDieTypeEnum

    switch (changeHpReason) {
      case ChangeHpReasonEnum.CHANGE_HP_SUB_MONSTER:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_KILL_BY_MONSTER
        break
      case ChangeHpReasonEnum.CHANGE_HP_SUB_GEAR:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_KILL_BY_GEAR
        break
      case ChangeHpReasonEnum.CHANGE_HP_SUB_FALL:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_FALL
        break
      case ChangeHpReasonEnum.CHANGE_HP_SUB_DRAWN:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_DRAWN
        break
      case ChangeHpReasonEnum.CHANGE_HP_SUB_ABYSS:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_ABYSS
        break
      case ChangeHpReasonEnum.CHANGE_HP_SUB_GM:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_GM
        break
      case ChangeHpReasonEnum.CHANGE_HP_SUB_CLIMATE_COLD:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_CLIMATE_COLD
        break
      case ChangeHpReasonEnum.CHANGE_HP_SUB_STORM_LIGHTNING:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_STORM_LIGHTING
        break
      default:
        dieType = PlayerDieTypeEnum.PLAYER_DIE_NONE
    }

    await this.kill(attackerId, dieType, seqId)
  }

  async heal(val: number, notify = false, changeHpReason?: ChangeHpReasonEnum, seqId?: number): Promise<void> {
    if (this.isLockHP || !this.isAlive()) return

    await this.fightProps.heal(val, notify, changeHpReason, seqId)
  }

  async fullHeal(notify = false, changeHpReason?: ChangeHpReasonEnum, seqId?: number): Promise<void> {
    if (this.isLockHP || !this.isAlive()) return

    await this.fightProps.fullHeal(notify, changeHpReason, seqId)
  }

  async kill(attackerId: number, dieType: PlayerDieTypeEnum, seqId?: number, batch = false): Promise<void> {
    // Can't die again if you are dead
    if (this.isDead()) return

    // Change life state
    this.lifeState = LifeStateEnum.LIFE_DEAD

    // Set die type and attacker
    this.dieType = dieType
    this.attackerId = attackerId

    // Emit death event
    await this.emit("Death", seqId, batch)
  }

  async revive(val?: number): Promise<void> {
    // Can't revive if you are not dead
    if (this.isAlive()) return

    // Change life state
    this.lifeState = LifeStateEnum.LIFE_ALIVE

    // Reset die type and remove attacker
    this.dieType = PlayerDieTypeEnum.PLAYER_DIE_NONE
    this.attackerId = null

    // Update cur hp
    const maxHp = this.getProp(FightPropEnum.FIGHT_PROP_MAX_HP)
    await this.setProp(
      FightPropEnum.FIGHT_PROP_CUR_HP,
      val != null ? Math.min(maxHp, Math.max(1, val)) : maxHp * 0.4,
      true
    )

    // Emit revive event
    await this.emit("Revive")
  }

  exportEntityAuthorityInfo(): EntityAuthorityInfo {
    const { abilityManager, bornPos } = this

    return {
      abilityInfo: abilityManager.exportAbilitySyncStateInfo(),
      rendererChangedInfo: {},
      aiInfo: {
        isAiOpen: true,
        bornPos: bornPos.export(),
      },
      bornPos: bornPos.export(),
      unknown1: {
        unknown1: {},
      },
    }
  }

  exportSceneEntityInfo(): SceneEntityInfo {
    const { entityId, protEntityType, motion, props, fightProps, lifeState } = this
    const { sceneTime, reliableSeq } = motion

    const sceneEntityInfo: SceneEntityInfo = {
      entityType: protEntityType,
      entityId,
      motionInfo: motion.export(),
      propList: [props.exportPropPair(PlayerPropEnum.PROP_LEVEL)],
      fightPropList: fightProps.exportPropList(),
      lifeState,
      animatorParaList: [{}],
      entityClientData: {},
      entityAuthorityInfo: this.exportEntityAuthorityInfo(),
    }

    if (sceneTime != null) sceneEntityInfo.lastMoveSceneTimeMs = sceneTime
    if (reliableSeq != null) sceneEntityInfo.lastMoveReliableSeq = reliableSeq

    switch (protEntityType) {
      case ProtEntityTypeEnum.PROT_ENTITY_AVATAR:
        sceneEntityInfo.avatar = this?.avatar.exportSceneAvatarInfo() || null
        break
      case ProtEntityTypeEnum.PROT_ENTITY_MONSTER:
        sceneEntityInfo.monster = this?.monster.exportSceneMonsterInfo() || null
        break
      case ProtEntityTypeEnum.PROT_ENTITY_NPC:
        sceneEntityInfo.npc = this?.npc.exportSceneNpcInfo() || null
        sceneEntityInfo.propList = []
        delete sceneEntityInfo.lifeState
        delete sceneEntityInfo.entityAuthorityInfo.abilityInfo
        break
      case ProtEntityTypeEnum.PROT_ENTITY_GADGET:
        sceneEntityInfo.gadget = this?.gadget.exportSceneGadgetInfo() || null
        break
    }

    return sceneEntityInfo
  }

  exportUserData(): EntityUserData {
    const { lifeState, props, fightProps } = this

    return {
      lifeState,
      propsData: props.exportUserData(),
      fightPropsData: fightProps.exportUserData(),
    }
  }

  /**Events**/

  // Death
  async handleDeath(seqId?: number, batch = false) {
    const { manager } = this

    // Broadcast life state change if on scene
    if (!manager) return

    await LifeStateChange.broadcastNotify(manager.scene.broadcastContextList, this)
    await manager.remove(this, VisionTypeEnum.VISION_DIE, seqId, batch)
  }
}
