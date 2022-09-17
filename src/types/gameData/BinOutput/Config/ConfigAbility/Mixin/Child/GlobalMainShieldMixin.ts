import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface GlobalMainShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'GlobalMainShieldMixin'
  ShieldType: string
  ShieldAngle: DynamicFloat
  ShieldHPRatio: DynamicFloat
  ShieldHP: DynamicFloat
  CostShieldRatioName: string
  ShowDamageText: string
  OnShieldBroken: ConfigAbilityAction[]
  AmountByGetDamage: DynamicFloat
  EffectPattern: string
  ChildShieldModifierName: string
  TargetMuteHitEffect: boolean
  InfiniteShield: boolean
  HealLimitedByCasterMaxHPRatio: DynamicFloat
  HealLimitedByLocalCreatureMaxHPRatio: DynamicFloat
}