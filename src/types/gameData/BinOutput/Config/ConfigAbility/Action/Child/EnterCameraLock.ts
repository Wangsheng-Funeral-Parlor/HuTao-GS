import ConfigBaseAbilityAction from '.'

export default interface EnterCameraLock extends ConfigBaseAbilityAction {
  $type: 'EnterCameraLock'
  TransName: string
  CfgPath: string
}