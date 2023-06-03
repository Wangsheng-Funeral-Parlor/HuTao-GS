import { AbilityScalarTypeEnum } from "./enum"

import { AbilityString } from "."

export interface AbilityScalarValueEntry {
  floatValue?: number
  stringValue?: string
  intValue?: number
  uintValue?: number

  key?: AbilityString
  valueType?: AbilityScalarTypeEnum
}
