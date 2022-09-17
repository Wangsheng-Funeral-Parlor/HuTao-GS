import { DynamicInt } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface BySummonTagValue extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'BySummonTagValue'
  SummonTag: number
  Value: DynamicInt
}