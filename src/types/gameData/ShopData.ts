export interface ShopData {
  Id: number
  ShopType: number
  ItemCount: number
  CostItems: {
    Id: number
    Count: number
  }[]
  BeginTime: number
  EndTime: number
  PreconditionParamList: string[]
  MinShowLevel: number
  MinPlayerLevel: number
  MaxPlayerLevel: number
  SortLevel: number
  IsBuyOnce: boolean

  ItemId?: number
  BuyLimit?: number
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

type ShopDataList = ShopData[]

export default ShopDataList