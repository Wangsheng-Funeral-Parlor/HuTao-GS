import ConfigBaseAbilityAction from '.'

export default interface AvatarExitFocus extends ConfigBaseAbilityAction {
  $type: 'AvatarExitFocus'
  KeepRotation: boolean
}