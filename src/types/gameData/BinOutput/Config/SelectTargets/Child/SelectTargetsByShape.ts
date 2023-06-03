import ConfigBaseSelectTargets from "."

import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface SelectTargetsByShape extends ConfigBaseSelectTargets {
  $type: "SelectTargetsByShape"
  ShapeName: string
  CenterBasedOn: string
  CampTargetType: string
  CampBasedOn: string
  SizeRatio: DynamicFloat
}
