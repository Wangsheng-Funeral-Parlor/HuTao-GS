import ConfigBaseAbilityAction from '.'

export default interface SetCameraLockTime extends ConfigBaseAbilityAction {
  $type: 'SetCameraLockTime'
  LockTime: number
}