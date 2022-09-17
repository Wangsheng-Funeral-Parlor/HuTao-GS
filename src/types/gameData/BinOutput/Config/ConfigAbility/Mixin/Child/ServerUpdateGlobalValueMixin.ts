import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface ServerUpdateGlobalValueMixin extends ConfigBaseAbilityMixin {
  $type: 'ServerUpdateGlobalValueMixin'
  Key: string
  UseLimitRange: boolean
  MaxValue: DynamicFloat
  MinValue: DynamicFloat
}