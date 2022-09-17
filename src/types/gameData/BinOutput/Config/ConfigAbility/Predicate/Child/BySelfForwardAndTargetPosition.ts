import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface BySelfForwardAndTargetPosition extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'BySelfForwardAndTargetPosition'
  Value: DynamicFloat
  IsXZ: boolean
}