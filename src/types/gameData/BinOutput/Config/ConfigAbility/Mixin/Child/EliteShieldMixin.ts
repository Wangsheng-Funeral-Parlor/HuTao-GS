import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface EliteShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'EliteShieldMixin'
  ShieldType: string
  ShieldAngle: DynamicFloat
  ShieldHPRatio: DynamicFloat
  ShieldHP: DynamicFloat
  CostShieldRatioName: string
  ShowDamageText: string
  OnShieldBroken: ConfigAbilityAction[]
  AmountByGetDamage: DynamicFloat
  TargetMuteHitEffect: boolean
  InfiniteShield: boolean
  HealLimitedByCasterMaxHPRatio: DynamicFloat
}