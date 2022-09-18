import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface SetPoseFloat extends ConfigBaseAbilityAction {
  $type: 'SetPoseFloat'
  FloatID: string
  Value: DynamicFloat
}