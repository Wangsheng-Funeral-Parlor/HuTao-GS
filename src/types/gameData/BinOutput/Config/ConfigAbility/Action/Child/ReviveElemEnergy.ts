import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface ReviveElemEnergy extends ConfigBaseAbilityAction {
  $type: 'ReviveElemEnergy'
  Value: DynamicFloat
}