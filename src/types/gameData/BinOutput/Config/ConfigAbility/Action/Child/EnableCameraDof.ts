import ConfigBaseAbilityAction from '.'

export default interface EnableCameraDof extends ConfigBaseAbilityAction {
  $type: 'EnableCameraDof'
  EnableDof: boolean
}