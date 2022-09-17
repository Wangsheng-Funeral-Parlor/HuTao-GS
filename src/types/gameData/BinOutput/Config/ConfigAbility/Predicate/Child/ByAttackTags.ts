import ConfigBaseAbilityPredicate from '.'

export default interface ByAttackTags extends ConfigBaseAbilityPredicate {
  $type: 'ByAttackTags'
  AttackTags: string[]
}