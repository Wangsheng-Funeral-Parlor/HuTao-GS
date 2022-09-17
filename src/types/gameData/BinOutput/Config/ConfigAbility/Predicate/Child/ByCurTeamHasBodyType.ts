import ConfigBaseAbilityPredicate from '.'

export default interface ByCurTeamHasBodyType extends ConfigBaseAbilityPredicate {
  $type: 'ByCurTeamHasBodyType'
  BodyType: string
  Number: number
  Logic: string
}