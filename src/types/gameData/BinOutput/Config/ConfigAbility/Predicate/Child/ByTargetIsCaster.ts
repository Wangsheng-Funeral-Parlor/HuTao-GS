import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetIsCaster extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetIsCaster'
  IsCaster: boolean
}