import ConfigBaseAbilityAction from '.'

export default interface ResetAbilitySpecial extends ConfigBaseAbilityAction {
  $type: 'ResetAbilitySpecial'
  KeyName: string
  ValueName: string
}