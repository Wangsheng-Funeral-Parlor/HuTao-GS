import Loader from '$/gameData/loader'
import ShopDataList, { ShopData } from '@/types/gameData/ShopData'

class ShopDataLoader extends Loader {
  declare data: ShopDataList

  constructor() {
    super('ShopData')
  }

  async getData(): Promise<ShopDataList> {
    return super.getData()
  }

  async getShop(id: number): Promise<ShopData> {
    return (await this.getShopList()).find(data => data.Id === id)
  }

  async getShopGoods(type: number): Promise<ShopData[]> {
    return (await this.getShopList()).filter(data => data.ShopType === type)
  }

  async getShopList(): Promise<ShopData[]> {
    return (await this.getData()) || []
  }
}

let loader: ShopDataLoader
export default (() => loader = loader || new ShopDataLoader())()