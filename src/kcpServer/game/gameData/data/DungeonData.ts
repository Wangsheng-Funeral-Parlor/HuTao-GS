import Loader from '$/gameData/loader'
import DungeonDataGroup, { DungeonData } from '@/types/data/DungeonData'

class DungeonDataLoader extends Loader {
  declare data: DungeonDataGroup

  constructor() {
    super('DungeonData')
  }

  getDungeon(id: number): DungeonData {
    return this.getDungeonList().find(data => data.Id === id)
  }

  getDungeonByScene(sceneId: number): DungeonData {
    return this.getDungeonList().find(data => data.SceneId === sceneId)
  }

  getDungeonList(): DungeonData[] {
    return this.data?.Dungeon || []
  }
}

let loader: DungeonDataLoader
export default (() => loader = loader || new DungeonDataLoader())()