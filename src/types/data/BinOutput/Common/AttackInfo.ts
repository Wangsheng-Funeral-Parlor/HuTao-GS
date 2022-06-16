import CameraShakeConfig from './CameraShake'

export default interface AttackInfoConfig {
  AttackTag: string
  AttenuationTag: string
  AttenuationGroup: string
  AttackProperty: {
    DamagePercentage: number
    DamagePercentageRatio: number
    ElementType?: string
    ElementDurability: number
    OverrideByWeapon?: boolean
    StrikeType?: string
    EndBreak?: number
    AttackType?: string
    BonusCritical?: number
    BonusCriticalHurt?: number
  }
  HitPattern: {
    OnHitEffectName: string
    HitImpulseType: string
    RetreatType?: string
    HitHaltTimeScale?: number
    CanBeDefenceHalt?: boolean
  }
  CameraShake?: CameraShakeConfig
}