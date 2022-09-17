import ConfigBaseAbilityPredicate from '.'

export default interface ByBigTeamHasBodyType extends ConfigBaseAbilityPredicate {
  $type: 'ByBigTeamHasBodyType'
  BodyType: string
  Number: number
  Logic: string
}