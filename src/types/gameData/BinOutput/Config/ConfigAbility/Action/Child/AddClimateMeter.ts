import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface AddClimateMeter extends ConfigBaseAbilityAction {
  $type: 'AddClimateMeter'
  ClimateType: string
  Value: DynamicFloat
}