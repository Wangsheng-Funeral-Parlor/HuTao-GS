import { AbilityIdentifier, AttackHitEffectResult, HitCollision, VectorInfo } from '.'

export interface AttackResult {
  attackerId: number
  defenseId: number
  animEventId: string
  abilityIdentifier: AbilityIdentifier
  damage: number
  isCrit: boolean
  hitCollision: HitCollision
  hitPosType: number
  endureBreak: number
  resolvedDir: VectorInfo
  hitRetreatAngleCompat: number
  hitEffResult: AttackHitEffectResult
  elementType: number
  useGadgetDamageAction: boolean
  gadgetDamageActionIdx: number
  isResistText: boolean
  criticalRand: number
  elementAmplifyRate: number
  damageShield: number
  muteElementHurt: boolean
  amplifyReactionType: number
  addhurtReactionType: number
  bulletFlyTimeMs: number
  attackCount: number
  hashedAnimEventId: number
  attackTimestampMs: number
  endureDelta: number
  targetType: number
  elementDurabilityAttenuation: number
}