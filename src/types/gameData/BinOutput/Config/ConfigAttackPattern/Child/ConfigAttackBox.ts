import ConfigSimpleAttackPattern from "./ConfigSimpleAttackPattern"

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigAttackBox extends ConfigSimpleAttackPattern {
  $type: "ConfigAttackBox"
  Size: DynamicVector
  MuteHitBehindScene: boolean
}
