import ConfigBaseScenePoint from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface DungeonRewardPoint extends ConfigBaseScenePoint {
  $type: "DungeonRewardPoint"
  IsActive: boolean
  DropPointList: DynamicVector[]
}
