import ConfigBaseAbilityPredicate from '.'

export default interface ByHitStrikeType extends ConfigBaseAbilityPredicate {
  $type: 'ByHitStrikeType'
  StrikeType: string
}