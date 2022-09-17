import ConfigBaseAbilityPredicate from '.'

export default interface ByCurTeamHasFeatureTag extends ConfigBaseAbilityPredicate {
  $type: 'ByCurTeamHasFeatureTag'
  FeatureTagID: number
  Number: number
  Logic: string
}