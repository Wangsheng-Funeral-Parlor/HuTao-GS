export interface WeaponPromoteExcelConfig {
  WeaponPromoteId: number
  CostItems: {
    Id?: number
    Count?: number
  }[]
  AddProps: {
    PropType: string
    Value?: number
  }[]
  UnlockMaxLevel: number
  PromoteLevel?: number
  RequiredPlayerLevel?: number
  CoinCost?: number
}

type WeaponPromoteExcelConfigList = WeaponPromoteExcelConfig[]

export default WeaponPromoteExcelConfigList
