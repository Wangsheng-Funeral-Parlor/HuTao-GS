import ConfigBaseAbilityPredicate from '.'

export default interface ByBigTeamHasElementType extends ConfigBaseAbilityPredicate {
  $type: 'ByBigTeamHasElementType'
  ElementType: string
  Number: number
  Logic: string
}