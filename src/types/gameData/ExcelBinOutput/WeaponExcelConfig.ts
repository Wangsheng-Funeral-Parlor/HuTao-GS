export interface WeaponExcelConfig {
  WeaponType: string
  RankLevel: number
  WeaponBaseExp: number
  SkillAffix: number[]
  WeaponProp: {
    Type: string
    PropType?: string
    InitValue?: number
  }[]
  AwakenTexture: string
  AwakenLightMapTexture: string
  AwakenIcon: string
  WeaponPromoteId: number
  AwakenCosts: number[]
  GachaCardNameHashSuffix: number
  GachaCardNameHashPre: number
  DestroyReturnMaterial: number[]
  DestroyReturnMaterialCount: number[]
  Id: number
  NameTextMapHash: number
  DescTextMapHash: number
  Icon: string
  ItemType: string
  Weight: number
  Rank: number
  GadgetId: number
  StoryId?: number
  DestroyRule?: string
  InitialLockState?: number
  AwakenMaterial?: number
  EnhanceRule?: number
  UnRotate?: boolean
}

type WeaponExcelConfigList = WeaponExcelConfig[]

export default WeaponExcelConfigList