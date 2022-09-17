import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByTargetAltitude extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByTargetAltitude'
  Value: DynamicFloat
}