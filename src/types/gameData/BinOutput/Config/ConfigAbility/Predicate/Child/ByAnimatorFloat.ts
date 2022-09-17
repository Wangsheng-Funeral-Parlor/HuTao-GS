import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByAnimatorFloat extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByAnimatorFloat'
  Value: DynamicFloat
  Parameter: string
}