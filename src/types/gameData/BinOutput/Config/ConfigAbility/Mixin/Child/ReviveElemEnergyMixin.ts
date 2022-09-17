import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface ReviveElemEnergyMixin extends ConfigBaseAbilityMixin {
  $type: 'ReviveElemEnergyMixin'
  Type: string
  Period: DynamicFloat
  BaseEnergy: DynamicFloat
  Ratio: DynamicFloat
}