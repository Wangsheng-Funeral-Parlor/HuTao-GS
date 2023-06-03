import ConfigBaseScenePoint from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface DungeonSlipRevivePoint extends ConfigBaseScenePoint {
  $type: "DungeonSlipRevivePoint"
  Size: DynamicVector
  IsActive: boolean
  GroupIds: number[]
}
