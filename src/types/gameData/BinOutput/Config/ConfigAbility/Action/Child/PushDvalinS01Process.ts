import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface PushDvalinS01Process extends ConfigBaseAbilityAction {
  $type: 'PushDvalinS01Process'
  Time: number
  ToPercentage: number
  UnBreak: boolean
  SetForce: boolean
  Vector: DynamicVector
  Attenuation: number
}