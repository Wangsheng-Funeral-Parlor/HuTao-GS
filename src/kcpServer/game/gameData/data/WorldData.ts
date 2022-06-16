import Loader from '$/gameData/loader'
import WorldDataList, { WorldData } from '@/types/data/WorldData'

class WorldDataLoader extends Loader {
  declare data: WorldDataList

  constructor() {
    super('WorldData', [])
  }

  get(id: number): WorldData {
    return this.data.find(data => data.Id === id)
  }
}

let loader: WorldDataLoader
export default (() => loader = loader || new WorldDataLoader())()