import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByTargetPositionToSelfPosition extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByTargetPositionToSelfPosition'
  CompareType: string
  Value: DynamicFloat
}