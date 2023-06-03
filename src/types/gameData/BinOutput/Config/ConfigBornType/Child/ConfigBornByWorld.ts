import ConfigBaseBornType from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBornByWorld extends ConfigBaseBornType {
  $type: "ConfigBornByWorld"
  WorldPos: DynamicVector
  WorldFwd: DynamicVector
}
