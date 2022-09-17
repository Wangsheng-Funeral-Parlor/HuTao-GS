import ConfigBaseAbilityAction from '.'

export default interface SetGlobalValue extends ConfigBaseAbilityAction {
  $type: 'SetGlobalValue'
  Value: number
  Key: string
  UseLimitRange?: boolean
  RandomInRange?: boolean
  MaxValue: number
  MinValue: number
}