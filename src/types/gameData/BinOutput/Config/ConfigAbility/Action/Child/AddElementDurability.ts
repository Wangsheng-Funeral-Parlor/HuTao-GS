import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface AddElementDurability extends ConfigBaseAbilityAction {
  $type: 'AddElementDurability'
  Value: DynamicFloat
  ModifierName: string
  ElementType: string
  SortModifier: string
  UseLimitRange: boolean
  MaxValue: DynamicFloat
  MinValue: DynamicFloat
}