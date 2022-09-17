import { DynamicInt } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByAnimatorInt extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByAnimatorInt'
  Value: DynamicInt
  Parameter: string
}