import ConfigSimpleAttackPattern from "./ConfigSimpleAttackPattern"

import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigAttackSphere extends ConfigSimpleAttackPattern {
  $type: "ConfigAttackSphere"
  Radius: DynamicFloat
}
