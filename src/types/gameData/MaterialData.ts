export interface MaterialData {
  ItemUse: {
    UseOp?: string
    UseParam: string[]
  }[]
  SatiationParams: number[]
  DestroyReturnMaterial: number[]
  DestroyReturnMaterialCount: number[]
  Id: number
  ItemType: string
  NoFirstGetHint: boolean
  IsForceGetHint: boolean
  UseOnGain: boolean
  IsSplitDrop: boolean
  CloseBagAfterUsed: boolean
  PlayGainEffect: boolean
  IsHidden: boolean

  RankLevel?: number
  Rank?: number
  EffectGadgetID?: number
  MaterialType?: string
  GadgetId?: number
  StackLimit?: number
  MaxUseCount?: number
  UseTarget?: string
  UseLevel?: number
  DestroyRule?: string
  Weight?: number
  SetID?: number
  FoodQuality?: string
  GlobalItemLimit?: number
  CdTime?: number
  CdGroup?: number
}

type MaterialDataList = MaterialData[]

export default MaterialDataList
