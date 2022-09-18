import ConfigBaseAbilityAction from '.'

export default interface EnableSceneTransformByName extends ConfigBaseAbilityAction {
  $type: 'EnableSceneTransformByName'
  TransformNames: string[]
  SetEnable: boolean
}