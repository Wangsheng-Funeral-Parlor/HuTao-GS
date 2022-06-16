import Loader from '$/gameData/loader'
import MaterialDataList, { MaterialData } from '@/types/data/MaterialData'

class MaterialDataLoader extends Loader {
  declare data: MaterialDataList

  constructor() {
    super('MaterialData', [])
  }

  get(id: number): MaterialData {
    return this.getList().find(data => data.Id === id)
  }

  getList(): MaterialData[] {
    return this.data || []
  }
}

let loader: MaterialDataLoader
export default (() => loader = loader || new MaterialDataLoader())()