import { ItemParam } from './item'

export interface ResinCard {
  baseItemList: ItemParam[]
  perDayItemList: ItemParam[]
}

export interface ProductPriceTier {
  productId: string
  priceTier: string
}

export interface ShopCardProduct {
  resinCard?: ResinCard

  productId: string
  priceTier: string
  mcoinBase: number
  hcoinPerDay: number
  days: number
  remainRewardDays?: number
  cardProductType: number
}

export interface ShopConcertProduct {
  productId: string
  priceTier: string
  obtainCount?: number
  obtainLimit: number
  beginTime: number
  endTime: number
  buyTimes?: number
}

export interface ShopGoods {
  goodsId: number
  goodsItem: ItemParam
  scoin?: number
  hcoin?: number
  costItemList?: ItemParam[]
  boughtNum?: number
  buyLimit?: number
  beginTime: number
  endTime: number
  nextRefreshTime: number
  minLevel: number
  maxLevel: number
  preGoodsIdList?: number[]
  mcoin?: number
  disableType?: number
  secondarySheetId?: number
  discountId?: number
  discountBeginTime?: number
  discountEndTime?: number
  singleLimit?: number
}

export interface ShopMcoinProduct {
  productId: string
  priceTier: string
  mcoinBase: number
  mcoinNonFirst: number
  mcoinFirst: number
  boughtNum?: number
  isAudit?: boolean
}

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