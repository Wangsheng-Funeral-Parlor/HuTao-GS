import { AbilityString } from '.'
import { AbilityScalarTypeEnum } from './enum'

export interface AbilityScalarValueEntry {
  floatValue?: number
  stringValue?: string
  intValue?: number
  uintValue?: number

  key?: AbilityString
  valueType?: AbilityScalarTypeEnum
}