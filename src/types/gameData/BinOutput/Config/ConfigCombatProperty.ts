export default interface ConfigCombatProperty {
  EndureType: string
  UseCreatorProperty: boolean
  UseCreatorPropertyPartly: string[]
  UseCreatorBuffedProperty: boolean
  UseAbilityProperty: boolean
  HP: number
  Attack: number
  Defense: number
  Weight: number
  EndureShake: number
  IsInvincible: boolean
  IsLockHP: boolean
  IsGhostToAllied: boolean
  IsGhostToEnemy: boolean
  CanTriggerBullet: boolean
  DenyElementStick: boolean
  IgnorePurgeRate: boolean
  IgnoreDamageToSelf: boolean
}
