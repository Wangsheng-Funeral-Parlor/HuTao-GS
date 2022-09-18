import ConfigBaseAbilityAction from '.'

export default interface AvatarDoBlink extends ConfigBaseAbilityAction {
  $type: 'AvatarDoBlink'
  PreferInput: boolean
  Distance: number
}