import ConfigBaseAbilityPredicate from '.'

export default interface ByCurTeamHasElementType extends ConfigBaseAbilityPredicate {
  $type: 'ByCurTeamHasElementType'
  ElementType: string
  Number: number
  Logic: string
}