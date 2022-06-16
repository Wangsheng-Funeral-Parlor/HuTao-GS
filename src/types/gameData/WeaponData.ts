export interface WeaponData {
  Type: string
  RankLevel: number
  BaseExp: number
  SkillAffix: number[]
  Prop: {
    Type: string
    PropType?: string
    InitValue?: number
  }[]
  PromoteId: number
  AwakenCosts: number[]
  GachaCardNameHashSuffix: number
  GachaCardNameHashPre: number
  DestroyReturnMaterial: number[]
  DestroyReturnMaterialCount: number[]
  Id: number
  ItemType: string
  Weight: number
  Rank: number
  GadgetId: number
  UnRotate: boolean

  DestroyRule?: string
  InitialLockState?: number
  AwakenMaterial?: number
  EnhanceRule?: number
}

export interface WeaponLevelData {
  Level: number
  RequiredExps: number[]
}

export interface WeaponPromoteData {
  Id: number
  CostItems: {
    Id: number
    Count: number
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

export default interface WeaponDataGroup {
  Weapon: WeaponData[]
  Level: WeaponLevelData[]
  Promote: WeaponPromoteData[]
}