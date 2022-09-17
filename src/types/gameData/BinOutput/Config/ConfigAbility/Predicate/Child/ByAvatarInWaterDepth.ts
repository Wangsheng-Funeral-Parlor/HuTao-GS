import ConfigBaseAbilityPredicate from '.'

export default interface ByAvatarInWaterDepth extends ConfigBaseAbilityPredicate {
  $type: 'ByAvatarInWaterDepth'
  CompareType: string
  Depth: number
}