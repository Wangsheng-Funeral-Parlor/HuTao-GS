import Loader from '$/gameData/loader'
import DungeonDataGroup, { DungeonData } from '@/types/gameData/DungeonData'

class DungeonDataLoader extends Loader {
  declare data: DungeonDataGroup

  constructor() {
    super('DungeonData')
  }

  async getData(): Promise<DungeonDataGroup> {
    return super.getData()
  }

  async getDungeon(id: number): Promise<DungeonData> {
    return (await this.getDungeonList()).find(data => data.Id === id)
  }

  async getDungeonByScene(sceneId: number): Promise<DungeonData> {
    return (await this.getDungeonList()).find(data => data.SceneId === sceneId)
  }

  async getDungeonList(): Promise<DungeonData[]> {
    return (await this.getData())?.Dungeon || []
  }
}

let loader: DungeonDataLoader
export default (() => loader = loader || new DungeonDataLoader())()