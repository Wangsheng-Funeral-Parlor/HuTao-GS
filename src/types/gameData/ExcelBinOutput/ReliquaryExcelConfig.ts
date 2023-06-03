export interface ReliquaryExcelConfig {
  EquipType: string
  RankLevel: number
  MainPropDepotId: number
  AppendPropDepotId: number
  AddPropLevels: number[]
  BaseConvExp: number
  MaxLevel: number
  DestroyReturnMaterial: number[]
  DestroyReturnMaterialCount: number[]
  Id: number
  ItemType: string
  Weight: number
  Rank: number
  GadgetId: number
  AppendPropNum?: number
  SetId?: number
  StoryId?: number
  DestroyRule?: string
  Dropable?: boolean
}

type ReliquaryExcelConfigList = ReliquaryExcelConfig[]

export default ReliquaryExcelConfigList
