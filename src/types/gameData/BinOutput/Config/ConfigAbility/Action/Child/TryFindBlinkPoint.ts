import ConfigBaseAbilityAction from '.'

export default interface TryFindBlinkPoint extends ConfigBaseAbilityAction {
  $type: 'TryFindBlinkPoint'
  ForwardAngle: number
  MinRange: number
  MaxRange: number
  LimitY: number
  IgnoreWater: boolean
}