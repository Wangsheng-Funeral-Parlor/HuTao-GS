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

  getStackLimit(): { [key: number]: number } {
    const materials = this.getMaterialList()
    const filteredMaterials = materials.filter((material) => material.ItemType === "ITEM_MATERIAL")

    const stackLimits: { [key: number]: number } = {}
    filteredMaterials.forEach((material) => {
      stackLimits[material.Id] = material.StackLimit ?? 9999
    })
    return stackLimits
  }
}

let loader: MaterialDataLoader
export default (() => (loader = loader || new MaterialDataLoader()))()
