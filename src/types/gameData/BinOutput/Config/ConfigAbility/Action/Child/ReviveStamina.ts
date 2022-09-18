import ConfigBaseAbilityAction from '.'
import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'

export default interface ReviveStamina extends ConfigBaseAbilityAction {
  $type: 'ReviveStamina'
  Value: DynamicFloat
}