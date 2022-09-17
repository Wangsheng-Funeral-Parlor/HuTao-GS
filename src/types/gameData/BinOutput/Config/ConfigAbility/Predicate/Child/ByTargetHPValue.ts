import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByTargetHPValue extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByTargetHPValue'
  HP: DynamicFloat
}