import Loader from '$/gameData/loader'
import ShopDataList, { ShopData } from '@/types/data/ShopData'

class ShopDataLoader extends Loader {
  declare data: ShopDataList

  constructor() {
    super('ShopData')
  }

  get(id: number): ShopData {
    return this.getList().find(data => data.Id === id)
  }

  getShopGoods(type: number): ShopData[] {
    return this.getList().filter(data => data.ShopType === type)
  }

  getList(): ShopData[] {
    return this.data || []
  }
}

let loader: ShopDataLoader
export default (() => loader = loader || new ShopDataLoader())()