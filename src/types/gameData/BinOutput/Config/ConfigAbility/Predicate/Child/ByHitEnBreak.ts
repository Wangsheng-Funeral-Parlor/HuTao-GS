import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByHitEnBreak extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByHitEnBreak'
  EnBreak: DynamicFloat
}