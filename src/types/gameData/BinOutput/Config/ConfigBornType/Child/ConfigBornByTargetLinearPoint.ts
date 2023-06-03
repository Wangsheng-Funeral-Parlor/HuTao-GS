import ConfigBaseBornType from "."

import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBornByTargetLinearPoint extends ConfigBaseBornType {
  $type: "ConfigBornByTargetLinearPoint"
  LinearOffset: DynamicFloat
  BaseOnTarget: boolean
  LinearXZ: boolean
  LinearMin: DynamicFloat
  LinearMax: DynamicFloat
}
