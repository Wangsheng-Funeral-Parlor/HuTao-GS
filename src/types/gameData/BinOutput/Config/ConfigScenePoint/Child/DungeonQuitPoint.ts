import ConfigBaseScenePoint from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface DungeonQuitPoint extends ConfigBaseScenePoint {
  $type: "DungeonQuitPoint"
  Size: DynamicVector
}
