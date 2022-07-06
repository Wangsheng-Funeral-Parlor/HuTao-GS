import Loader from '$/gameData/loader'
import MaterialDataList, { MaterialData } from '@/types/gameData/MaterialData'

class MaterialDataLoader extends Loader {
  declare data: MaterialDataList

  constructor() {
    super('MaterialData', [])
  }

  async getData(): Promise<MaterialDataList> {
    return super.getData()
  }

  async getMaterial(id: number): Promise<MaterialData> {
    return (await this.getMaterialList()).find(data => data.Id === id)
  }

  async getMaterialList(): Promise<MaterialData[]> {
    return (await this.getData()) || []
  }
}

let loader: MaterialDataLoader
export default (() => loader = loader || new MaterialDataLoader())()