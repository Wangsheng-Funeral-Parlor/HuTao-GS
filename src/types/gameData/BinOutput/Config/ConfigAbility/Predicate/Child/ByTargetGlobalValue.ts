import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetGlobalValue extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetGlobalValue'
  Key: string
  Value: DynamicFloat
  MaxValue: DynamicFloat
  ForceByCaster: boolean
  CompareType?: string
}