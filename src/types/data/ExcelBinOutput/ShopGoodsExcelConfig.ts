export interface ShopGoodsExcelConfig {
  GoodsId: number
  SubTagNameTextMapHash: number
  ShopType: number
  ItemCount: number
  CostItems: {
    Id?: number
    Count?: number
  }[]
  BeginTime: string
  EndTime: string
  PreconditionParamList: string[]
  MinShowLevel: number
  MinPlayerLevel: number
  MaxPlayerLevel: number
  SortLevel: number
  PlatformTypeList: any[]
  ItemId?: number
  BuyLimit?: number
  IsBuyOnce?: boolean
  Precondition?: string
  CostScoin?: number
  RefreshType?: string
  RefreshParam?: number
  SubTabId?: number
  CostHcoin?: number
  RotateId?: number
  DiscountRate?: number
  OriginalPrice?: number
  PreconditionParam?: number
  ShowId?: number
  CostMcoin?: number
  SecondarySheetId?: number
  ChooseOneGroupId?: number
}

type ShopGoodsExcelConfigList = ShopGoodsExcelConfig[]

export default ShopGoodsExcelConfigList