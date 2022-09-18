import ConfigBaseAbilityAction from '.'

export default interface SetAvatarCanShakeOff extends ConfigBaseAbilityAction {
  $type: 'SetAvatarCanShakeOff'
  CanShakeOff: boolean
}