export interface MaterialExcelConfig {
  InteractionTitleTextMapHash: number
  ItemUse: {
    UseOp?: string
    UseParam: string[]
  }[]
  EffectDescTextMapHash: number
  SpecialDescTextMapHash: number
  TypeDescTextMapHash: number
  EffectIcon: string
  EffectName: string
  PicPath: string[]
  SatiationParams: number[]
  DestroyReturnMaterial: number[]
  DestroyReturnMaterialCount: number[]
  Id: number
  NameTextMapHash: number
  DescTextMapHash: number
  Icon: string
  ItemType: string

  NoFirstGetHint?: boolean
  RankLevel?: number
  Rank?: number
  EffectGadgetID?: number
  MaterialType?: string
  GadgetId?: number
  IsForceGetHint?: boolean
  StackLimit?: number
  MaxUseCount?: number
  UseOnGain?: boolean
  UseTarget?: string
  UseLevel?: number
  IsSplitDrop?: boolean
  DestroyRule?: string
  Weight?: number
  SetID?: number
  CloseBagAfterUsed?: boolean
  FoodQuality?: string
  GlobalItemLimit?: number
  CdTime?: number
  CdGroup?: number
  PlayGainEffect?: boolean
  IsHidden?: boolean
}

type MaterialExcelConfigList = MaterialExcelConfig[]

export default MaterialExcelConfigList
