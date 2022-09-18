import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface SetAnimatorFloat extends ConfigBaseAbilityAction {
  $type: 'SetAnimatorFloat'
  FloatID: string
  Value: DynamicFloat
  Persistent: boolean
  UseRandomValue: boolean
  RandomValueMin: DynamicFloat
  RandomValueMax: DynamicFloat
}