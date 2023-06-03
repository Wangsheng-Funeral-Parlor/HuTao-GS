import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigAttackProperty {
  DamagePercentage: DynamicFloat
  DamagePercentageRatio: DynamicFloat
  ElementType: string
  ElementRank: number
  ElementDurability: DynamicFloat
  OverrideByWeapon: boolean
  IgnoreAttackerProperty: boolean
  StrikeType: string
  EnBreak: number
  EnHeadBreak: number
  AttackType: string
  DamageExtra: DynamicFloat
  BonusCritical: DynamicFloat
  BonusCriticalHurt: DynamicFloat
  IgnoreLevelDiff: boolean
  TrueDamage: boolean
}
