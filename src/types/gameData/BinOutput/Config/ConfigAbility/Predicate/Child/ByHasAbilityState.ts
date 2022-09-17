import ConfigBaseAbilityPredicate from '.'

export default interface ByHasAbilityState extends ConfigBaseAbilityPredicate {
  $type: 'ByHasAbilityState'
  AbilityState: string
}