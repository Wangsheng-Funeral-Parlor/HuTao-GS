import SceneData from "$/gameData/data/SceneData"
import Player from "$/player"
import Scene from "$/scene"
import SceneGroup from "$/scene/sceneGroup"
import Logger from "@/logger"
import { EventTypeEnum } from "@/types/enum"

const logger = new Logger("ScriptManager", 0xff7f50)
export default class scriptManager {
  scene: Scene
  sceneGroups: Map<number, SceneGroup>

  currentGroup: SceneGroup

  constructor(scene: Scene) {
    this.scene = scene
    this.sceneGroups = new Map()
  }
  get host(): Player {
    return this.scene.world.host
  }
  setGroup(sceneGroup: SceneGroup) {
    this.sceneGroups.set(sceneGroup.id, sceneGroup)
  }

  getGroup(id: number): SceneGroup {
    return this.sceneGroups.get(id)
  }

  async emit(type: EventTypeEnum, groupId: number, ...args: any[]) {
    const { scriptTrigger, scriptLoader } = this.scene
    this.currentGroup = this.sceneGroups.get(groupId)

    if (this.currentGroup != undefined) await scriptTrigger.runTrigger(scriptLoader, this, type, ...args)
    else logger.error(`No group with id ${groupId}`)
  }

  async RefreshGroup(groupId: number, suite: number) {
    const group = this.getGroup(groupId)

    if (!group) return

    const { block } = group
    const { scene } = block
    const { entityManager } = scene
    const { id: sceneId } = block.scene

    const groupData = await SceneData.getGroup(sceneId, groupId)

    group.monsterList.forEach((monster) => entityManager.remove(monster, undefined, undefined, true))
    group.gadgetList.forEach((gadget) => entityManager.remove(gadget, undefined, undefined, true))
    group.npcList.forEach((npc) => entityManager.remove(npc, undefined, undefined, true))
    group.monsterList = []
    group.gadgetList = []
    group.npcList = []

    group.trigger =
      groupData.Triggers.filter((trigger) => groupData.Suites?.[suite - 1]?.Triggers?.includes(trigger.Name)) || []

    await group.loadMonsters(
      Object.values(
        groupData.Monsters?.filter((monster) => groupData.Suites?.[suite - 1]?.Monsters?.includes(monster.ConfigId)) ||
          {}
      )
    )
    await group.loadNpcs(Object.values(groupData.Npcs || {}), Object.values(groupData.Suites || {}))
    await group.loadGadgets(
      Object.values(
        groupData.Gadgets?.filter((gadget) => groupData.Suites?.[suite - 1]?.Gadgets?.includes(gadget.ConfigId)) || {}
      )
    )
  }

  async addGroupSuite(groupId: number, suite: number) {
    const group = this.getGroup(groupId)
    const { block } = group
    const { id: sceneId } = block.scene
    const groupData = SceneData.getGroup(sceneId, groupId)

    group.trigger =
      groupData.Triggers.filter((trigger) => groupData.Suites?.[suite - 1]?.Triggers?.includes(trigger.Name)) || []

    await group.loadMonsters(
      Object.values(
        groupData.Monsters?.filter((monster) => groupData.Suites?.[suite - 1]?.Monsters?.includes(monster.ConfigId)) ||
          {}
      ),
      true
    )
    await group.loadGadgets(
      Object.values(
        groupData.Gadgets?.filter((gadget) => groupData.Suites?.[suite - 1]?.Gadgets?.includes(gadget.ConfigId)) || {}
      ),
      true
    )
  }

  async CreateMonster(groupId: number, configId: number, delayTime = 0) {
    const group = this.getGroup(groupId)

    const { block } = group
    const { id: sceneId } = block.scene

    const groupData = await SceneData.getGroup(sceneId, groupId)

    setTimeout(() => {
      group.loadMonsters(
        Object.values(groupData.Monsters?.filter((monster) => monster.ConfigId == configId) || {}),
        true
      )
    }, delayTime)
  }

  async CreateGadget(groupId: number, configId: number) {
    const group = this.getGroup(groupId)

    const { block } = group
    const { id: sceneId } = block.scene

    const groupData = await SceneData.getGroup(sceneId, groupId)

    await group.loadGadgets(
      Object.values(groupData.Gadgets?.filter((gadget) => gadget.ConfigId == configId) || {}),
      true
    )
  }
}
