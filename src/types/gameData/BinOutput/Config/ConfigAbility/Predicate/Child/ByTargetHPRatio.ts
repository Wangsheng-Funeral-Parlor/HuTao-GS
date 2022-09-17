import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByTargetHPRatio extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByTargetHPRatio'
  HPRatio: DynamicFloat
}