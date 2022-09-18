import ConfigBaseAbilityAction from '.'

export default interface EnableAfterImage extends ConfigBaseAbilityAction {
  $type: 'EnableAfterImage'
  Enable: boolean
  Index: number
}