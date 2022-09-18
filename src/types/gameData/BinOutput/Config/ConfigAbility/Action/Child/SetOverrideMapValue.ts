import ConfigBaseAbilityAction from '.'

export default interface SetOverrideMapValue extends ConfigBaseAbilityAction {
  $type: 'SetOverrideMapValue'
  Value: number
  OverrideMapKey: string
}