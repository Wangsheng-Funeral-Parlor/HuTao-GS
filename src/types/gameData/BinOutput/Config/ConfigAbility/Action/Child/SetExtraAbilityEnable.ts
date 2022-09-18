import ConfigBaseAbilityAction from '.'

export default interface SetExtraAbilityEnable extends ConfigBaseAbilityAction {
  $type: 'SetExtraAbilityEnable'
  Enable: boolean
}