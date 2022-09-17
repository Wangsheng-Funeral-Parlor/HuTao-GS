import ConfigBaseAbilityAction from '.'

export default interface StartDither extends ConfigBaseAbilityAction {
  $type: 'StartDither'
  Duration: number
  Reverse?: boolean
}