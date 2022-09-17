import Loader from '$/gameData/loader'
import ConfigScenePoint from '$DT/BinOutput/Config/ConfigScenePoint'
import DungeonEntry from '$DT/BinOutput/Config/ConfigScenePoint/Child/DungeonEntry'
import SceneDataList, { SceneData } from '@/types/gameData/SceneData'
import { SceneBlockScriptConfig, SceneGroupScriptConfig } from '@/types/gameData/Script/SceneScriptConfig'

class SceneDataLoader extends Loader {
  declare data: SceneDataList

  constructor() {
    super('SceneData', [])
  }

  async getData(): Promise<SceneDataList> {
    return super.getData()
  }

  async getScene(sceneId: number): Promise<SceneData> {
    return (await this.getData())?.find(scene => scene.Id === sceneId) || null
  }

  async getSceneList(): Promise<SceneData[]> {
    return (await this.getData()) || []
  }

  async getScenePoint(sceneId: number, pointId: number): Promise<ConfigScenePoint> {
    return (await this.getScenePointMap(sceneId))[pointId] || null
  }

  async getScenePointMap(sceneId: number): Promise<{ [id: number]: ConfigScenePoint }> {
    return (await this.getScene(sceneId))?.Config?.Points || {}
  }

  async getDungeonEntry(entryPointId: number): Promise<DungeonEntry> {
    const sceneData = await this.getData()

    for (const sceneId in sceneData) {
      const pointMap = await this.getScenePointMap(parseInt(sceneId))
      for (const pointId in pointMap) {
        const point = pointMap[pointId]
        if (!point || parseInt(pointId) !== entryPointId || point.$type !== 'DungeonEntry') continue

        return point
      }
    }

    return null
  }

  async getGroup(sceneId: number, groupId: number): Promise<SceneGroupScriptConfig> {
    return (await this.getGroupMap(sceneId))[groupId] || null
  }

  async getGroupMap(sceneId: number): Promise<{ [id: number]: SceneGroupScriptConfig }> {
    return (await this.getScene(sceneId))?.Group || {}
  }

  async getBlock(sceneId: number, blockId: number): Promise<SceneBlockScriptConfig> {
    return (await this.getBlockMap(sceneId))[blockId] || null
  }

  async getBlockMap(sceneId: number): Promise<{ [id: number]: SceneBlockScriptConfig }> {
    return (await this.getScene(sceneId))?.Block || {}
  }
}

let loader: SceneDataLoader
export default (() => loader = loader || new SceneDataLoader())()