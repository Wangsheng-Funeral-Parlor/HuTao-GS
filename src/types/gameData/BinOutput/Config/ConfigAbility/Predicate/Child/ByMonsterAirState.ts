import ConfigBaseAbilityPredicate from '.'

export default interface ByMonsterAirState extends ConfigBaseAbilityPredicate {
  $type: 'ByMonsterAirState'
  IsAirMove: boolean
}