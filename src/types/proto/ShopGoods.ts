import { ItemParam } from "."

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
