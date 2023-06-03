import ConfigSimpleAttackPattern from "./ConfigSimpleAttackPattern"

import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigAttackCircle extends ConfigSimpleAttackPattern {
  $type: "ConfigAttackCircle"
  Height: number
  FanAngle: number
  Radius: DynamicFloat
  InnerRadius: DynamicFloat
  DetectDirection: string
}
