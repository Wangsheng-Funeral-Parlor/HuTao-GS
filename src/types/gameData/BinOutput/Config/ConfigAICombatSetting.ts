export default interface ConfigAICombatSetting {
  CombatPhases: { [phase: string]: number[] }
  CombatRole: string
  BroadcastFearOnDeath: boolean
}
