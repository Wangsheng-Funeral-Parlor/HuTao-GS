import Loader from '$/gameData/loader'
import MapAreaDataList, { MapAreaData } from '@/types/gameData/MapAreaData'

class MapAreaDataLoader extends Loader {
  declare data: MapAreaDataList

  constructor() {
    super('MapAreaData', [])
  }

  async getData(): Promise<MapAreaDataList> {
    return super.getData()
  }

  async getMapArea(id: number): Promise<MapAreaData> {
    return (await this.getMapAreaList()).find(data => data.Id === id)
  }

  async getMapAreaList(): Promise<MapAreaData[]> {
    return (await this.getData()) || []
  }
}

let loader: MapAreaDataLoader
export default (() => loader = loader || new MapAreaDataLoader())()