import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface AvatarLockForwardFlyMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarLockForwardFlyMixin'
  WorldForward: DynamicVector
  FlySpeedScale: number
  FlyBackSpeedScale: number
  EularRawInput: DynamicVector
}