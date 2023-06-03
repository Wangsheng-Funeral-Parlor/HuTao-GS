import ConfigBaseScenePoint from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface DungeonWayPoint extends ConfigBaseScenePoint {
  $type: "DungeonWayPoint"
  Size: DynamicVector
  IsBoss: boolean
  IsActive: boolean
  GroupIds: number[]
}
