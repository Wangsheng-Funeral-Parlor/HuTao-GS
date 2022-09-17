import ConfigBaseAbilityPredicate from '.'

export default interface ByIsTargetCamp extends ConfigBaseAbilityPredicate {
  $type: 'ByIsTargetCamp'
  CampBaseOn: string
  CampTargetType: string
}