import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ElementTypeModifier from '$DT/BinOutput/Config/ElementTypeModifier'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface ModifyDamageMixin extends ConfigBaseAbilityMixin {
  $type: 'ModifyDamageMixin'
  AnimEventNames: string[]
  AttackTags: string[]
  AttackType: string
  IgnoreEventInfo: boolean
  DamagePercentage: DynamicFloat
  DamagePercentageRatio: DynamicFloat
  DamageExtra: DynamicFloat
  BonusCritical: DynamicFloat
  BonusCriticalHurt: DynamicFloat
  ElementTypeModifier: ElementTypeModifier
  Predicates: ConfigAbilityPredicate[]
  TrueDamage: boolean
}