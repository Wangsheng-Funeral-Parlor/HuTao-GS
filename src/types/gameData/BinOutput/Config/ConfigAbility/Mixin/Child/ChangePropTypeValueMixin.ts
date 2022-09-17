import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface ChangePropTypeValueMixin extends ConfigBaseAbilityMixin {
  $type: 'ChangePropTypeValueMixin'
  PropType: string
  EnergyCostDelta: DynamicFloat
}