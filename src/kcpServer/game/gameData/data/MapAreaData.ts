import Loader from '$/gameData/loader'
import MapAreaDataList, { MapAreaData } from '@/types/gameData/MapAreaData'

class MapAreaDataLoader extends Loader {
  declare data: MapAreaDataList

  constructor() {
    super('MapAreaData', [])
  }

  get(id: number): MapAreaData {
    return this.data?.find(data => data.Id === id)
  }

  getList(): MapAreaData[] {
    return this.data || []
  }
}

let loader: MapAreaDataLoader
export default (() => loader = loader || new MapAreaDataLoader())()