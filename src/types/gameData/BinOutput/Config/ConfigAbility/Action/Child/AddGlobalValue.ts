import ConfigBaseAbilityAction from '.'

export default interface AddGlobalValue extends ConfigBaseAbilityAction {
  $type: 'AddGlobalValue'
  Value: number
  Key: string
  UseLimitRange?: boolean
  RandomInRange?: boolean
  MaxValue: number
  MinValue: number
}