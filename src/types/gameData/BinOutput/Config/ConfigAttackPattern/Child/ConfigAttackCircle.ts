import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigSimpleAttackPattern from './ConfigSimpleAttackPattern'

export default interface ConfigAttackCircle extends ConfigSimpleAttackPattern {
  $type: 'ConfigAttackCircle'
  Height: number
  FanAngle: number
  Radius: DynamicFloat
  InnerRadius: DynamicFloat
  DetectDirection: string
}