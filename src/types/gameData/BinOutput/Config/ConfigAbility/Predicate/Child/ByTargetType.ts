import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetType extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetType'
  TargetType: string
  IsTarget: boolean
}