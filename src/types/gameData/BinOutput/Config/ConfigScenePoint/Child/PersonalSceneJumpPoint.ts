import ConfigBaseScenePoint from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface PersonalSceneJumpPoint extends ConfigBaseScenePoint {
  $type: "PersonalSceneJumpPoint"
  TranSceneId: number
  TitleTextID: string
  TriggerSize: DynamicVector
  IsHomeworldDoor: boolean
}
