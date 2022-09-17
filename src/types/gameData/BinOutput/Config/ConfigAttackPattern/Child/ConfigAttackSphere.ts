import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigSimpleAttackPattern from './ConfigSimpleAttackPattern'

export default interface ConfigAttackSphere extends ConfigSimpleAttackPattern {
  $type: 'ConfigAttackSphere'
  Radius: DynamicFloat
}