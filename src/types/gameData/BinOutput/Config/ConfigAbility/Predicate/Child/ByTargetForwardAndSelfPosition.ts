import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByTargetForwardAndSelfPosition extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByTargetForwardAndSelfPosition'
  Value: DynamicFloat
  IsXZ: boolean
}