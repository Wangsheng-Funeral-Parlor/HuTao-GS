import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByLocalAvatarStamina extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByLocalAvatarStamina'
  Stamina: DynamicFloat
}