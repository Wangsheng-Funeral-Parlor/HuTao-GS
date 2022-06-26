import Loader from '$/gameData/loader'
import PointConfig from '@/types/gameData/BinOutput/ScenePoint/Point'
import DungeonEntry from '@/types/gameData/BinOutput/ScenePoint/Point/DungeonEntry'
import SceneDataList, { SceneData } from '@/types/gameData/SceneData'
import { SceneBlockScriptConfig, SceneGroupScriptConfig } from '@/types/gameData/Script/SceneScriptConfig'

class SceneDataLoader extends Loader {
  declare data: SceneDataList

  constructor() {
    super('SceneData', [])
  }

  getScene(sceneId: number): SceneData {
    return this.data?.find(scene => scene.Id === sceneId) || null
  }

  getSceneList(): SceneData[] {
    return this.data || []
  }

  getScenePoint(sceneId: number, pointId: number): PointConfig {
    return this.getScenePointMap(sceneId)[pointId] || null
  }

  getScenePointMap(sceneId: number): { [id: number]: PointConfig } {
    return this.getScene(sceneId)?.ScenePoint?.Points || {}
  }

  getDungeonEntry(entryPointId: number): DungeonEntry {
    const { data } = this

    for (let sceneId in data) {
      const pointMap = this.getScenePointMap(parseInt(sceneId))
      for (let pointId in pointMap) {
        const point = pointMap[pointId]
        if (!point || parseInt(pointId) !== entryPointId || point.$type !== 'DungeonEntry') continue

        return <DungeonEntry>point
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
export default (() => loader = loader || new SceneDataLoader())()