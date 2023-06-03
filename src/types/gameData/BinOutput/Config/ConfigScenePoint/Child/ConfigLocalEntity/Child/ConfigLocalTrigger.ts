import ConfigBaseLocalEntity from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"
import ConfigShape from "$DT/BinOutput/Config/ConfigShape"

export default interface ConfigLocalTrigger extends ConfigBaseLocalEntity {
  $type: "ConfigLocalTrigger"
  TriggerFlag: string
  Shape: ConfigShape
  CheckCount: number
  TriggerInterval: number
  VectorParam: DynamicVector
  FloatParam: number
  StringParam: string
}
