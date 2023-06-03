import ConfigAttackEvent from "./ConfigAttackEvent"
import ConfigCombatBeHit from "./ConfigCombatBeHit"
import ConfigCombatLock from "./ConfigCombatLock"
import ConfigCombatProperty from "./ConfigCombatProperty"
import ConfigDie from "./ConfigDie"
import ConfigSummon from "./ConfigSummon"

export default interface ConfigCombat {
  Property: ConfigCombatProperty
  BeHit: ConfigCombatBeHit
  CombatLock: ConfigCombatLock
  Die: ConfigDie
  AnimEvents: { [key: string]: ConfigAttackEvent }
  Summon: ConfigSummon
}
