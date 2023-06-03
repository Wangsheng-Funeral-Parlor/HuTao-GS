import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBaseScenePoint {
  Type: string
  GadgetId: number
  AreaId: number
  Pos: DynamicVector
  Rot: DynamicVector
  TranPos: DynamicVector
  TranRot: DynamicVector
  Unlocked: boolean
  Alias: string
  GroupLimit: boolean
}
