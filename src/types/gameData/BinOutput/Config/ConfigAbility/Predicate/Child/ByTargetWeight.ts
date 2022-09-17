import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByTargetWeight extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByTargetWeight'
  Weight: DynamicFloat
}