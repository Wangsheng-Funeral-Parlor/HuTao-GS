import Loader from '$/gameData/loader'
import PointConfig from '@/types/data/BinOutput/ScenePoint/Point'
import DungeonEntry from '@/types/data/BinOutput/ScenePoint/Point/DungeonEntry'
import SceneDataList, { SceneData } from '@/types/data/SceneData'

class SceneDataLoader extends Loader {
  declare data: SceneDataList

  constructor() {
    super('SceneData', [])
  }

  getScene(sceneId: number): SceneData {
    return this.data?.find(scene => scene.Id === sceneId)
  }

  getSceneList(): SceneData[] {
    return this.data || []
  }

  getScenePointMap(sceneId: number): { [id: number]: PointConfig } {
    return this.getScene(sceneId)?.ScenePoint?.Points || {}
  }

  getScenePoint(sceneId: number, pointId: number): PointConfig {
    return this.getScenePointMap(sceneId)[pointId]
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
}

let loader: SceneDataLoader
export default (() => loader = loader || new SceneDataLoader())()