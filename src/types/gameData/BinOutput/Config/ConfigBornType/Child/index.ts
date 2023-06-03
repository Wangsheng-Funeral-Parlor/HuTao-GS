import BornRandom from "../../BornRandom/BornRandom"
import ConfigBornDirectionType from "../../ConfigBornDirectionType"

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBaseBornType {
  Offset: DynamicVector
  BornRandom: BornRandom
  OnGround: boolean
  OnGroundIgnoreWater: boolean
  OnGroundRaycastUpDist: number
  Direction: ConfigBornDirectionType
  AlongGround: boolean
  UseRotation: boolean
}
