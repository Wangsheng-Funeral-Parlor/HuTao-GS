import ConfigHitImpulse from "./ConfigHitImpulse"

import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigHitPattern {
  OnHitEffectName: string
  HitLevel: string
  HitImpulseX: DynamicFloat
  HitImpulseY: DynamicFloat
  HitImpulseType: string
  OverrideHitImpulse: ConfigHitImpulse
  RetreatType: string
  hitHaltTimeRawNum: number
  hitHaltTimeScaleRawNum: number
  CanBeDefenceHalt: boolean
  MuteHitText: boolean
  Recurring: boolean
}
