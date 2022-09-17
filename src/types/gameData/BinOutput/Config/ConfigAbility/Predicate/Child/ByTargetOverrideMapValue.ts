import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByTargetOverrideMapValue extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByTargetOverrideMapValue'
  TargetAbilityName: string
  TargetKey: string
  TargetValue: DynamicFloat
}