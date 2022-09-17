import ConfigBaseAbilityPredicate from '.'

export default interface ByCurrentSceneTypes extends ConfigBaseAbilityPredicate {
  $type: 'ByCurrentSceneTypes'
  SceneTypes: string[]
}