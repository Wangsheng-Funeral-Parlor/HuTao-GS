export interface ReliquaryData {
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

export interface ReliquaryMainPropData {
  Id: number
  PropDepotId: number
  PropType: string
  AffixName: string
}

export interface ReliquaryAffixData {
  Id: number
  DepotId: number
  GroupId: number
  PropType: string
  PropValue: number
}

export interface ReliquaryLevelData {
  Level: number
  AddProps: {
    PropType: string
    Value: number
  }[]
  Rank?: number
  Exp?: number
}

export interface ReliquarySetData {
  Id: number
  SetNeedNum: number[]
  ContainsList: number[]
  EquipAffixId?: number
  DisableFilter?: number
}

export default interface ReliquaryDataGroup {
  Reliquary: ReliquaryData[]
  MainProp: ReliquaryMainPropData[]
  Affix: ReliquaryAffixData[]
  Level: ReliquaryLevelData[]
  Set: ReliquarySetData[]
}