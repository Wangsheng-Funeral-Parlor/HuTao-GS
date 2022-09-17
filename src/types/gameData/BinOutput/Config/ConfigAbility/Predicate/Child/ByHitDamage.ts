import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByHitDamage extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByHitDamage'
  Damage: DynamicFloat
}