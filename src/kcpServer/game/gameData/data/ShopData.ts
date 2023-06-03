import Loader from "$/gameData/loader"
import ShopDataList, { ShopData } from "@/types/gameData/ShopData"

class ShopDataLoader extends Loader {
  declare data: ShopDataList

  constructor() {
    super("ShopData", "message.cache.debug.shop")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getShop(id: number): ShopData {
    return this.getShopList().find((data) => data.Id === id)
  }

  getShopGoods(type: number): ShopData[] {
    return this.getShopList().filter((data) => data.ShopType === type)
  }

  getShopList(): ShopData[] {
    return this.data || []
  }
}

let loader: ShopDataLoader
export default (() => (loader = loader || new ShopDataLoader()))()
