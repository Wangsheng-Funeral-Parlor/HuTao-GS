import Loader from "$/gameData/loader"
import MaterialDataList, { MaterialData } from "@/types/gameData/MaterialData"

class MaterialDataLoader extends Loader {
  declare data: MaterialDataList

  constructor() {
    super("MaterialData", "message.cache.debug.material", [])
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getMaterial(id: number): MaterialData {
    return this.getMaterialList().find((data) => data.Id === id)
  }

  getMaterialList(): MaterialData[] {
    return this.data || []
  }
}

let loader: MaterialDataLoader
export default (() => (loader = loader || new MaterialDataLoader()))()
