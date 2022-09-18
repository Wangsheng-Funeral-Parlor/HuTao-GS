import ConfigBaseAbilityAction from '.'

export default interface EnableHeadControl extends ConfigBaseAbilityAction {
  $type: 'EnableHeadControl'
  Enable: boolean
  Blend: boolean
}