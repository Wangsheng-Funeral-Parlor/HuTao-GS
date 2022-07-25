import { ShopCardProduct, ShopConcertProduct, ShopGoods, ShopMcoinProduct } from '.'

export interface Shop {
  shopType: number
  goodsList?: ShopGoods[]
  mcoinProductList?: ShopMcoinProduct[]
  cardProductList?: ShopCardProduct[]
  nextRefreshTime?: number
  cityId?: number
  cityReputationLevel?: number
  concertProductList?: ShopConcertProduct[]
}