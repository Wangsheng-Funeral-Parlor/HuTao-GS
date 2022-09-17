import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface ResistClimateMixin extends ConfigBaseAbilityMixin {
  $type: 'ResistClimateMixin'
  ClimateTypes: string[]
  Source: string
  Trend: string
  Ratio: DynamicFloat
  Type: string
}