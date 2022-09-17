import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByLocalAvatarStaminaRatio extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByLocalAvatarStaminaRatio'
  StaminaRatio: DynamicFloat
}