import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface MultiplyGlobalValue extends ConfigBaseAbilityAction {
  $type: 'MultiplyGlobalValue'
  Value: DynamicFloat
  Key: string
  UseLimitRange: boolean
  RandomInRange: boolean
  MaxValue: DynamicFloat
  MinValue: DynamicFloat
}