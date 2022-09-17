import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'

export default interface ConfigPickupMulti {
  DirMinVec: DynamicVector
  DirMaxVec: DynamicVector
  MaxNum: number
  MinNum: number
  AttractSpeed: number
  UseWorldTrans: boolean
  IsAutoAttract: boolean
}