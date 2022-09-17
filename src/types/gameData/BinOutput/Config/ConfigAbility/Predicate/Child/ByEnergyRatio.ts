import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByEnergyRatio extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByEnergyRatio'
  Ratio: DynamicFloat
}