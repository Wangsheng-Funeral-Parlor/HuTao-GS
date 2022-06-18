import BaseClass from '#/baseClass'
import Gadget from '$/entity/gadget'
import Monster from '$/entity/monster'
import SceneData from '$/gameData/data/SceneData'
import WorldData from '$/gameData/data/WorldData'
import { VIEW_DIST } from '$/manager/entityManager'
import Player from '$/player'
import Vector from '$/utils/vector'
import Logger from '@/logger'
import Scene from '.'

const logger = new Logger('GSCENE', 0xefa8ec)

export default class SceneBlock extends BaseClass {
  scene: Scene

  id: number
  groups: {
    Id: number
    Pos: Vector
  }[]

  playerList: Player[]
  monsterList: Monster[]
  gadgetList: Gadget[]

  loaded: boolean
  frame: number

  constructor(scene: Scene, id: number, groups: any[]) {
    super()

    this.scene = scene

    this.id = id
    this.groups = groups.map(group => ({
      Id: group.Id,
      Pos: new Vector().setData(group.Pos)
    }))

    this.playerList = []
    this.monsterList = []
    this.gadgetList = []

    super.initHandlers(this)
  }

  private loadMonsters(groupId: number, monsters: any[]) {
    const { id, scene, monsterList } = this
    const { world, entityManager } = scene

    const worldLevelData = WorldData.getWorldLevel(world.level)
    const levelOffset = worldLevelData == null ? 0 : (worldLevelData.MonsterLevel - 22)

    for (let monster of monsters) {
      const { MonsterId, ConfigId, PoseId, IsElite, Level, Pos, Rot } = monster
      const entity = new Monster(MonsterId)

      entity.groupId = groupId
      entity.configId = ConfigId
      entity.blockId = id
      entity.isElite = !!IsElite

      if (PoseId != null) entity.poseId = PoseId

      entity.motionInfo.pos.setData(Pos)
      entity.motionInfo.rot.setData(Rot)
      entity.bornPos.setData(Pos)

      entity.initNew(Math.max(1, Math.min(100, Level + levelOffset)))

      monsterList.push(entity)
      entityManager.add(entity, undefined, undefined, undefined, undefined, true)
    }
  }

  private loadGadgets(_groupId: number, _gadgets: any[]) {
    return
  }

  private unloadMonsters(groupId: number) {
    const { scene, monsterList } = this
    const { entityManager } = scene

    const unloaded: Monster[] = []

    for (let monster of monsterList) {
      if (monster.groupId !== groupId) continue

      entityManager.unregister(monster, true)
      unloaded.push(monster)
    }

    this.monsterList = monsterList.filter(monster => !unloaded.includes(monster))
  }

  private unloadGadgets(groupId: number) {
    const { scene, gadgetList } = this
    const { entityManager } = scene

    const unloaded: Gadget[] = []

    for (let gadget of gadgetList) {
      if (gadget.groupId !== groupId) continue

      entityManager.unregister(gadget, true)
      unloaded.push(gadget)
    }

    this.gadgetList = gadgetList.filter(gadget => !unloaded.includes(gadget))
  }

  tryAddPlayer(player: Player) {
    const { scene, playerList, loaded } = this
    const { currentScene, sceneBlockList } = player

    if (currentScene !== scene || !this.inRange(player)) return

    playerList.push(player)
    sceneBlockList.push(this)

    if (!loaded) this.load()
  }

  tryRemovePlayer(player: Player) {
    const { scene, playerList, loaded } = this
    const { currentScene, sceneBlockList } = player

    if (currentScene === scene && this.inRange(player)) return

    playerList.splice(playerList.indexOf(player), 1)
    sceneBlockList.splice(sceneBlockList.indexOf(this), 1)

    if (loaded && playerList.length === 0) this.unload()
  }

  inRange(player: Player): boolean {
    const { groups } = this
    const pos = player?.currentAvatar?.motionInfo?.pos
    if (!pos) return false

    for (let group of groups) {
      if (pos.distanceTo2D(group.Pos) <= VIEW_DIST) return true
    }

    return false
  }

  load() {
    const { id, scene, groups, loaded } = this
    if (loaded) return

    this.loaded = true

    const groupDataMap = SceneData.getScene(scene.id)?.Group || {}
    for (let group of groups) {
      const { Id } = group
      const groupData = groupDataMap[Id]

      if (!groupData) continue

      this.loadMonsters(Id, Object.values(groupData.Monsters || {}))
      this.loadGadgets(Id, Object.values(groupData.Gadgets || {}))
    }

    logger.debug('Load block:', id)
  }

  unload() {
    const { id, groups, playerList, loaded } = this
    if (!loaded) return

    this.loaded = false

    for (let group of groups) {
      const { Id } = group

      this.unloadMonsters(Id)
      this.unloadGadgets(Id)
    }

    playerList.splice(0)

    logger.debug('Unload block:', id)
  }

  /**Internal Events**/

  async handleUpdate() {
    const { scene, playerList, loaded, frame } = this
    const { playerList: scenePlayerList } = scene

    // Update every 3 frames
    this.frame++
    if (loaded && frame % 3 !== 0) return

    for (let player of scenePlayerList) {
      if (playerList.includes(player)) this.tryRemovePlayer(player)
      else this.tryAddPlayer(player)
    }
  }
}