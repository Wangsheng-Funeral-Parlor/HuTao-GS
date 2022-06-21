import BaseClass from '#/baseClass'
import Vector from '$/utils/vector'
import EntityManager from '$/manager/entityManager'
import MotionInfo from './motionInfo'
import FightProp from './fightProps'
import EntityProps from './entityProps'
import AbilityList from '../ability/abilityList'
import { LifeStateEnum, ProtEntityTypeEnum, VisionTypeEnum } from '@/types/enum/entity'
import { FightPropEnum } from '@/types/enum/fightProp'
import { PlayerDieTypeEnum, PlayerPropEnum } from '@/types/enum/player'
import { SceneAvatarInfo } from '@/types/game/avatar'
import { EntityFightPropConfig, SceneEntityInfo } from '@/types/game/entity'
import { SceneGadgetInfo } from '@/types/game/gadget'
import { SceneMonsterInfo } from '@/types/game/monster'
import { SceneNpcInfo } from '@/types/game/npc'
import LifeStateChange from '#/packets/LifeStateChange'
import { CurveExcelConfig } from '@/types/gameData/ExcelBinOutput/CurveExcelConfig'
import EntityUserData from '@/types/user/EntityUserData'

export default class Entity extends BaseClass {
  manager?: EntityManager

  entityType: ProtEntityTypeEnum
  entityId: number

  name?: string

  groupId: number
  configId: number
  blockId: number

  config: EntityFightPropConfig
  growCurve: CurveExcelConfig[]

  abilityList: AbilityList
  props: EntityProps
  fightProps: FightProp
  motionInfo: MotionInfo

  bornPos: Vector

  animatorParaList: any[]

  lifeState: LifeStateEnum
  godMode: boolean

  dieType: PlayerDieTypeEnum
  attackerId: number

  isOnScene: boolean

  constructor() {
    super()

    this.abilityList = new AbilityList(this)
    this.props = new EntityProps(this)
    this.fightProps = new FightProp(this)
    this.motionInfo = new MotionInfo()

    this.bornPos = new Vector()

    this.groupId = 0
    this.configId = 0
    this.blockId = 0

    this.isOnScene = false
  }

  init(userData: EntityUserData) {
    const { props, abilityList, fightProps } = this
    const { lifeState, propsData, fightPropsData } = userData

    this.lifeState = typeof lifeState === 'number' ? lifeState : LifeStateEnum.LIFE_ALIVE

    props.init(propsData)
    fightProps.init(fightPropsData)

    abilityList.update()
    fightProps.update()
  }

  initNew(level: number = 1) {
    const { props, abilityList, fightProps } = this

    this.lifeState = LifeStateEnum.LIFE_ALIVE

    props.initNew(level)

    abilityList.update()
    fightProps.update()
  }

  isAlive() {
    return this.lifeState === LifeStateEnum.LIFE_ALIVE
  }

  get level() {
    return this.props.get(PlayerPropEnum.PROP_LEVEL)
  }

  get exp() {
    return this.props.get(PlayerPropEnum.PROP_EXP)
  }

  get promoteLevel() {
    return this.props.get(PlayerPropEnum.PROP_BREAK_LEVEL)
  }

  set level(v: number) {
    this.props.set(PlayerPropEnum.PROP_LEVEL, v)
  }

  set exp(v: number) {
    this.props.set(PlayerPropEnum.PROP_EXP, v)
  }

  set promoteLevel(v: number) {
    this.props.set(PlayerPropEnum.PROP_BREAK_LEVEL, v)
  }

  get authorityPeerId() {
    const { manager } = this
    return manager?.scene?.host?.peerId || 1
  }

  distanceTo(entity: Entity) {
    return this.motionInfo.distanceTo(entity.motionInfo)
  }

  gridEqual(grid: Vector) {
    return this.motionInfo.pos.grid.equal(grid)
  }

  async kill(attackerId: number, dieType: PlayerDieTypeEnum): Promise<void> {
    // Can't die again if you are dead
    if (!this.isAlive()) return

    // Change life state
    this.lifeState = LifeStateEnum.LIFE_DEAD

    // Set die type and attacker
    this.dieType = dieType
    this.attackerId = attackerId

    // Emit death event
    await this.emit('Death')
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

  // placeholder
  exportSceneAvatarInfo(): SceneAvatarInfo { return null }
  exportSceneMonsterInfo(): SceneMonsterInfo { return null }
  exportSceneNpcInfo(): SceneNpcInfo { return null }
  exportSceneGadgetInfo(): SceneGadgetInfo { return null }

  exportSceneEntityInfo(): SceneEntityInfo {
    const { entityId, entityType, motionInfo, bornPos, props, fightProps, lifeState } = this
    const { sceneTime, reliableSeq } = motionInfo

    const sceneEntityInfo: SceneEntityInfo = {
      entityType,
      entityId,
      motionInfo: motionInfo.export(),
      propList: [
        props.exportPropPair(PlayerPropEnum.PROP_LEVEL)
      ],
      fightPropList: fightProps.exportPropList(),
      lifeState,
      animatorParaList: [{}],
      entityClientData: {},
      entityAuthorityInfo: {
        abilityInfo: {},
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

    if (sceneTime != null) sceneEntityInfo.lastMoveSceneTimeMs = sceneTime
    if (reliableSeq != null) sceneEntityInfo.lastMoveReliableSeq = reliableSeq

    switch (entityType) {
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

  /**Internal Events**/

  // Death
  async handleDeath() {
    const { manager } = this

    // Broadcast life state change if on scene
    if (!manager) return

    await LifeStateChange.broadcastNotify(manager.scene.broadcastContextList, this)
    await manager.remove(this, VisionTypeEnum.VISION_DIE)
  }

  async handleRegister() {
    const { manager, abilityList } = this
    abilityList.register(manager?.scene?.abilitymanager)
  }

  async handleUnregister() {
    const { manager, abilityList } = this
    abilityList.unregister(manager?.scene?.abilitymanager)
  }
}