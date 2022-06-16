import ConfigAttackBox from './ConfigAttackBox'
import ConfigAttackCircle from './ConfigAttackCircle'
import ConfigAttackSphere from './ConfigAttackSphere'

export interface AttackPattern {
  $type: string
  TriggerType: string
}

type AttackPatternConfig =
  ConfigAttackBox |
  ConfigAttackCircle |
  ConfigAttackSphere

export default AttackPatternConfig