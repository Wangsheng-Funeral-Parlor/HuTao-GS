import ConfigBaseAbilityPredicate from '.'

export default interface ByAttackType extends ConfigBaseAbilityPredicate {
  $type: 'ByAttackType'
  AttackType: string
}