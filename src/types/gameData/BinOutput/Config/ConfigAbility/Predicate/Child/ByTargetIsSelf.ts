import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetIsSelf extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetIsSelf'
  IsSelf: boolean
}