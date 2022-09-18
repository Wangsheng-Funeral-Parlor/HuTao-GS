import ConfigBaseAbilityAction from '.'

export default interface EnablePositionSynchronization extends ConfigBaseAbilityAction {
  $type: 'EnablePositionSynchronization'
  Enable: boolean
}