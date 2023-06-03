import Loader from "$/gameData/loader"
import ConfigScenePoint from "$DT/BinOutput/Config/ConfigScenePoint"
import DungeonEntry from "$DT/BinOutput/Config/ConfigScenePoint/Child/DungeonEntry"
import SceneDataList, { SceneData } from "@/types/gameData/SceneData"
import { SceneBlockScriptConfig, SceneGroupScriptConfig } from "@/types/gameData/Script/SceneScriptConfig"

class SceneDataLoader extends Loader {
  declare data: SceneDataList

  constructor() {
    super("SceneData", "message.cache.debug.scene", [])
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getScene(sceneId: number): SceneData {
    return this.data?.find((scene) => scene.Id === sceneId) || null
  }

  getSceneList(): SceneData[] {
    return this.data || []
  }

  getScenePoint(sceneId: number, pointId: number): ConfigScenePoint {
    return this.getScenePointMap(sceneId)[pointId] || null
  }

  getScenePointMap(sceneId: number): { [id: number]: ConfigScenePoint } {
    return this.getScene(sceneId)?.Config?.Points || {}
  }

  getDungeonEntry(entryPointId: number): DungeonEntry {
    const sceneData = this.getData()

    for (const sceneId in sceneData) {
      const pointMap = this.getScenePointMap(parseInt(sceneId))
      for (const pointId in pointMap) {
        const point = pointMap[pointId]
        if (!point || parseInt(pointId) !== entryPointId || point.$type !== "DungeonEntry") continue

        return point
      }
    }

    return null
  }

  getGroup(sceneId: number, groupId: number): SceneGroupScriptConfig {
    return this.getGroupMap(sceneId)[groupId] || null
  }

  getGroupMap(sceneId: number): { [id: number]: SceneGroupScriptConfig } {
    return this.getScene(sceneId)?.Group || {}
  }

  getBlock(sceneId: number, blockId: number): SceneBlockScriptConfig {
    return this.getBlockMap(sceneId)[blockId] || null
  }

  getBlockMap(sceneId: number): { [id: number]: SceneBlockScriptConfig } {
    return this.getScene(sceneId)?.Block || {}
  }
}

let loader: SceneDataLoader
export default (() => (loader = loader || new SceneDataLoader()))()
