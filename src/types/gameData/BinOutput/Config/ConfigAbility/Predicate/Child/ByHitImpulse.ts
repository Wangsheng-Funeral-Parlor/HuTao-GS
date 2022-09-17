import ConfigBaseAbilityPredicate from '.'

export default interface ByHitImpulse extends ConfigBaseAbilityPredicate {
  $type: 'ByHitImpulse'
  HitImpulse: number
}