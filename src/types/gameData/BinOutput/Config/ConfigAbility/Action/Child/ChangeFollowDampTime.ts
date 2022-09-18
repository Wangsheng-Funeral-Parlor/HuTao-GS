import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface ChangeFollowDampTime extends ConfigBaseAbilityAction {
  $type: 'ChangeFollowDampTime'
  EffectPattern: string
  PositionDampTime: DynamicFloat
  RotationDampTime: DynamicFloat
}