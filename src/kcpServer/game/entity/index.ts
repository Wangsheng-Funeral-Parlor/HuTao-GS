import BaseClass from '#/baseClass'
import LifeStateChange from '#/packets/LifeStateChange'
import AbilityManager from '$/manager/abilityManager'
import EntityManager from '$/manager/entityManager'
import Vector from '$/utils/vector'
import { EntityTypeEnum, FightPropEnum, PlayerPropEnum } from '@/types/enum'
import { EntityFightPropConfig } from '@/types/game'
import { CurveExcelConfig } from '@/types/gameData/ExcelBinOutput/CurveExcelConfig'
import { EntityAuthorityInfo, SceneAvatarInfo, SceneEntityInfo, SceneGadgetInfo, SceneMonsterInfo, SceneNpcInfo } from '@/types/proto'
import { ChangeHpReasonEnum, LifeStateEnum, PlayerDieTypeEnum, ProtEntityTypeEnum, VisionTypeEnum } from '@/types/proto/enum'
import EntityUserData from '@/types/user/EntityUserData'
import EntityProps from './entityProps'
import FightProp from './fightProps'
import Motion from './motion'

export default class Entity extends BaseClass {
  manager?: EntityManager

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

  animatorParaList: any[]

  lifeState: LifeStateEnum
  godMode: boolean

  dieType: PlayerDieTypeEnum
  attackerId: number

  isOnScene: boolean
  gridHash: number

  constructor() {
    super()

    this.abilityManager = new AbilityManager(this)
    this.props = new EntityProps(this)
    this.fightProps = new FightProp(this)
    this.motion = new Motion()

    this.authorityPeerId = null

    this.bornPos = new Vector()

    this.groupId = 0
    this.configId = 0
    this.blockId = 0

    this.isOnScene = false
  }

  async init(userData: EntityUserData) {
    const { props, fightProps } = this
    const { lifeState, propsData, fightPropsData } = userData

    this.lifeState = typeof lifeState === 'number' ? lifeState : LifeStateEnum.LIFE_ALIVE

    props.init(propsData)
    fightProps.init(fightPropsData)

    await fightProps.update()
  }

  async initNew(level: number = 1) {
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
    ) return false

    const peerId = playerList?.find(player => !player.noAuthority && player.loadedEntityIdList.includes(entityId))?.peerId
    if (peerId == null) return false

    this.authorityPeerId = peerId

    return authorityPeerId != null
  }

  async takeDamage(attackerId: number, val: number, notify: boolean = false, changeHpReason?: ChangeHpReasonEnum, seqId?: number): Promise<void> {
    await this.fightProps.takeDamage(attackerId, val, notify, changeHpReason, seqId)
  }

  async kill(attackerId: number, dieType: PlayerDieTypeEnum, seqId?: number): Promise<void> {
    // Can't die again if you are dead
    if (this.isDead()) return

    // Change life state
    this.lifeState = LifeStateEnum.LIFE_DEAD

    // Set die type and attacker
    this.dieType = dieType
    this.attackerId = attackerId

    // Emit death event
    await this.emit('Death', seqId)
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
    const maxHp = this.fightProps.get(FightPropEnum.FIGHT_PROP_MAX_HP)
    await this.fightProps.set(FightPropEnum.FIGHT_PROP_CUR_HP, val != null ? Math.min(maxHp, Math.max(1, val)) : (maxHp * 0.4), true)

    // Emit revive event
    await this.emit('Revive')
  }

  exportEntityAuthorityInfo(): EntityAuthorityInfo {
    const { abilityManager, bornPos } = this

    return {
      abilityInfo: abilityManager.exportAbilitySyncStateInfo(),
      rendererChangedInfo: {},
      aiInfo: {
        isAiOpen: true,
        bornPos: bornPos.export()
      },
      bornPos: bornPos.export(),
      unknown1: {
        unknown1: {}
      }
    }
  }

  // placeholder
  exportSceneAvatarInfo(): SceneAvatarInfo { return null }
  exportSceneMonsterInfo(): SceneMonsterInfo { return null }
  exportSceneNpcInfo(): SceneNpcInfo { return null }
  exportSceneGadgetInfo(): SceneGadgetInfo { return null }

  exportSceneEntityInfo(): SceneEntityInfo {
    const { entityId, protEntityType, motion, props, fightProps, lifeState } = this
    const { sceneTime, reliableSeq } = motion

    const sceneEntityInfo: SceneEntityInfo = {
      entityType: protEntityType,
      entityId,
      motionInfo: motion.export(),
      propList: [
        props.exportPropPair(PlayerPropEnum.PROP_LEVEL)
      ],
      fightPropList: fightProps.exportPropList(),
      lifeState,
      animatorParaList: [{}],
      entityClientData: {},
      entityAuthorityInfo: this.exportEntityAuthorityInfo()
    }

    if (sceneTime != null) sceneEntityInfo.lastMoveSceneTimeMs = sceneTime
    if (reliableSeq != null) sceneEntityInfo.lastMoveReliableSeq = reliableSeq

    switch (protEntityType) {
      case ProtEntityTypeEnum.PROT_ENTITY_AVATAR:
        sceneEntityInfo.avatar = this.exportSceneAvatarInfo()
        break
      case ProtEntityTypeEnum.PROT_ENTITY_MONSTER:
        sceneEntityInfo.monster = this.exportSceneMonsterInfo()
        break
      case ProtEntityTypeEnum.PROT_ENTITY_NPC:
        sceneEntityInfo.npc = this.exportSceneNpcInfo()
        sceneEntityInfo.propList = []
        delete sceneEntityInfo.lifeState
        delete sceneEntityInfo.entityAuthorityInfo.abilityInfo
        break
      case ProtEntityTypeEnum.PROT_ENTITY_GADGET:
        sceneEntityInfo.gadget = this.exportSceneGadgetInfo()
        break
    }

    return sceneEntityInfo
  }

  exportUserData(): EntityUserData {
    const { lifeState, props, fightProps } = this

    return {
      lifeState,
      propsData: props.exportUserData(),
      fightPropsData: fightProps.exportUserData()
    }
  }

  /**Events**/

  // Death
  async handleDeath() {
    const { manager } = this

    // Broadcast life state change if on scene
    if (!manager) return

    await LifeStateChange.broadcastNotify(manager.scene.broadcastContextList, this)
    await manager.remove(this, VisionTypeEnum.VISION_DIE)
  }
}