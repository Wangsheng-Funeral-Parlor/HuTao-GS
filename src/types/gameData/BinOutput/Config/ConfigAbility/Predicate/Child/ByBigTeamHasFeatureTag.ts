import ConfigBaseAbilityPredicate from '.'

export default interface ByBigTeamHasFeatureTag extends ConfigBaseAbilityPredicate {
  $type: 'ByBigTeamHasFeatureTag'
  FeatureTagID: number
  Number: number
  Logic: string
}