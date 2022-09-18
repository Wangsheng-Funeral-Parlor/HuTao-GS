import ConfigBaseAbilityAction from '.'

export default interface EnableMainInterface extends ConfigBaseAbilityAction {
  $type: 'EnableMainInterface'
  Enable: boolean
}