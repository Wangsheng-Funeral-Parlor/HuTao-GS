import Loader from "$/gameData/loader"
import MapAreaDataList, { MapAreaData } from "@/types/gameData/MapAreaData"

class MapAreaDataLoader extends Loader {
  declare data: MapAreaDataList

  constructor() {
    super("MapAreaData", "message.cache.debug.mapArea", [])
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  async getMapArea(id: number): Promise<MapAreaData> {
    return this.getMapAreaList().find((data) => data.Id === id)
  }

  getMapAreaList(): MapAreaData[] {
    return this.data || []
  }
}

let loader: MapAreaDataLoader
export default (() => (loader = loader || new MapAreaDataLoader()))()
