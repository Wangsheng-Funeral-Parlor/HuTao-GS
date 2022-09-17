import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface ElementShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementShieldMixin'
  ElementType: string
  ShowDamageText: string
  ShieldAngle: DynamicFloat
  ShieldHPRatio: DynamicFloat
  ShieldHP: DynamicFloat
  DamageRatio: DynamicFloat
  OnShieldBroken: ConfigAbilityAction[]
  OnShieldSuccess: ConfigAbilityAction[]
  OnShieldFailed: ConfigAbilityAction[]
  UseMutiPlayerFixData: boolean
}