import ConfigBaseAbilityAction from '.'

export default interface ControlEmotion extends ConfigBaseAbilityAction {
  $type: 'ControlEmotion'
  ToggleEmoSync: boolean
  ToggleBlink: boolean
  ToggleEyeKey: boolean
}