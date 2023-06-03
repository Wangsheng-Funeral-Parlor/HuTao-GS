import ConfigAttackInfo from "./ConfigAttackInfo"
import ConfigAttackPattern from "./ConfigAttackPattern"

export default interface ConfigAttackEvent {
  AttackPattern: ConfigAttackPattern
  AttackInfo: ConfigAttackInfo
}
