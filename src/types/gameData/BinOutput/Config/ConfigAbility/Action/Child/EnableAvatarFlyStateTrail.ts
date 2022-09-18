import ConfigBaseAbilityAction from '.'

export default interface EnableAvatarFlyStateTrail extends ConfigBaseAbilityAction {
  $type: 'EnableAvatarFlyStateTrail'
  SetEnable: boolean
}