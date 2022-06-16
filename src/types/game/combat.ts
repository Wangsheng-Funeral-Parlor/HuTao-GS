import { HitColliderTypeEnum } from "../enum/combat"
import { AnimatorParameterValueInfo } from "./entity"
import { MotionInfoInterface, VectorInterface } from "./motion"

export interface AbilityIdentifier {
  instancedAbilityId: number
  abilityCasterId: number
  localId: number
  instancedModifierId: number
  modifierOwnerId: number
  isServerbuffModifier: boolean
}

export interface AttackHitEffectResult {
  hitEffLevel: number
  retreatStrength: number
  airStrength: number
  hitHaltTime: number
  hitHaltTimeScale: number
  originalHitEffLevel: number
}

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
  resolvedDir: VectorInterface
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

export interface EntityMoveInfo {
  entityId: number
  motionInfo: MotionInfoInterface
  sceneTime: number
  reliableSeq: number
  isReliable: boolean
}

export interface EvtAnimatorParameterInfo {
  entityId: number
  nameId: number
  isServerCache: boolean
  value: AnimatorParameterValueInfo
}

export interface EvtAnimatorStateChangedInfo {
  entityId: number
  toStateHash: number
  normalizedTimeCompact: number
  faceAngleCompact: number
  pos: VectorInterface
  fadeDuration: number
}

export interface EvtSetAttackTargetInfo {
  entityId: number
  attackTargetId: number
}

export interface EvtBeingHitInfo {
  peerId: number
  attackResult: AttackResult
  frameNum: number
}

export interface HitCollision {
  hitColliderType: HitColliderTypeEnum
  hitBoxIndex: number
  hitPoint: VectorInterface
  hitDir: VectorInterface
  attackeeHitForceAngle: number
  attackeeHitEntityAngle: number
}