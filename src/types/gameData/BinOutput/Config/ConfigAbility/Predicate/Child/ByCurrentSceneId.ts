import ConfigBaseAbilityPredicate from '.'

export default interface ByCurrentSceneId extends ConfigBaseAbilityPredicate {
  $type: 'ByCurrentSceneId'
  SceneIds: number[]
}