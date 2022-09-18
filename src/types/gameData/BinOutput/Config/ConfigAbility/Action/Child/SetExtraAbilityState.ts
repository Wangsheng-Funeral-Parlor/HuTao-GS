import ConfigBaseAbilityAction from '.'

export default interface SetExtraAbilityState extends ConfigBaseAbilityAction {
  $type: 'SetExtraAbilityState'
  State: string
}