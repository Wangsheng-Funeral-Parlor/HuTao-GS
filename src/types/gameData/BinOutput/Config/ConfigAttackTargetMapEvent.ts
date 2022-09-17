import ConfigAttackInfo from './ConfigAttackInfo'
import ConfigAttackPattern from './ConfigAttackPattern'

export default interface ConfigAttackTargetMapEvent {
  AttackPattern: ConfigAttackPattern
  AttackInfoMap: { [targetType: string]: ConfigAttackInfo }
}