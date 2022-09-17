import ConfigBaseAbilityPredicate from '.'

export default interface ByHitBoxType extends ConfigBaseAbilityPredicate {
  $type: 'ByHitBoxType'
  HitBoxType: string
}