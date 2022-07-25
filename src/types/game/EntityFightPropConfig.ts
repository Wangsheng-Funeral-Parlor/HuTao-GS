export interface EntityFightPropConfig {
  // Common
  HpBase?: number
  AttackBase?: number
  DefenseBase?: number

  PropGrowCurves: {
    PropType: string
    Type: string
    Value?: number
  }[]

  // Avatar
  Critical?: number
  CriticalHurt?: number

  // Monster
  IceSubHurt?: number
  GrassSubHurt?: number
  WindSubHurt?: number
  ElecSubHurt?: number
  PhysicalSubHurt?: number
}