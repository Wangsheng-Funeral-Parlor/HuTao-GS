import ConfigBaseAbilityPredicate from '.'

export default interface ByHasFeatureTag extends ConfigBaseAbilityPredicate {
  $type: 'ByHasFeatureTag'
  FeatureTagIDs: number[]
}