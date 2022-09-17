import ConfigBaseAbilityPredicate from '.'

export default interface ByDieStateFlag extends ConfigBaseAbilityPredicate {
  $type: 'ByDieStateFlag'
  DieStateFlag: string
}