import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigSimpleAttackPattern from './ConfigSimpleAttackPattern'

export default interface ConfigAttackBox extends ConfigSimpleAttackPattern {
  $type: 'ConfigAttackBox'
  Size: DynamicVector
  MuteHitBehindScene: boolean
}