import ConfigBaseAbilityPredicate from '.'

export default interface ByHitBoxName extends ConfigBaseAbilityPredicate {
  $type: 'ByHitBoxName'
  HitBoxNames: string[]
}