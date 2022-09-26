import BaseClass from '#/baseClass'
import { PacketContext } from '#/packet'
import CombatInvocations from '#/packets/CombatInvocations'
import Entity from '$/entity'
import Scene from '$/scene'
import TLogger from '@/translate/tlogger'
import { ClientStateEnum, FightPropEnum } from '@/types/enum'
import { CombatInvokeEntry, EntityMoveInfo, EvtBeingHitInfo } from '@/types/proto'
import { ChangeHpReasonEnum, CombatTypeArgumentEnum, MotionStateEnum, ProtEntityTypeEnum } from '@/types/proto/enum'
import { dataToProtobuffer } from '@/utils/proto'

const fallDamageConfig = {
  fall: {
    index: 0,
    sign: 1,
    threshold: [-28, -26.5, -25, -23.5],
    multiplier: [1, 0.66, 0.5, 0.33]
  },
  plunge: {
    index: 1,
    sign: -1,
    threshold: [-16, -12, -8],
    multiplier: [0.4, 0.2, 0.1]
  }
}

const protoLookupTable = {
  COMBAT_NONE: null,
  COMBAT_EVT_BEING_HIT: 'EvtBeingHitInfo',
  COMBAT_ANIMATOR_STATE_CHANGED: 'EvtAnimatorStateChangedInfo',
  COMBAT_FACE_TO_DIR: 'EvtFaceToDirInfo',
  COMBAT_SET_ATTACK_TARGET: 'EvtSetAttackTargetInfo',
  COMBAT_RUSH_MOVE: 'EvtRushMoveInfo',
  COMBAT_ANIMATOR_PARAMETER_CHANGED: 'EvtAnimatorParameterInfo',
  ENTITY_MOVE: 'EntityMoveInfo',
  SYNC_ENTITY_POSITION: 'EvtSyncEntityPositionInfo',
  COMBAT_STEER_MOTION_INFO: 'EvtCombatSteerMotionInfo',
  COMBAT_FORCE_SET_POS_INFO: 'EvtCombatForceSetPosInfo',
  COMBAT_COMPENSATE_POS_DIFF: 'EvtCompensatePosDiffInfo',
  COMBAT_MONSTER_DO_BLINK: 'EvtMonsterDoBlink',
  COMBAT_FIXED_RUSH_MOVE: 'EvtFixedRushMove',
  COMBAT_SYNC_TRANSFORM: 'EvtSyncTransform',
  COMBAT_LIGHT_CORE_MOVE: 'EvtLightCoreMove'
}

const logger = new TLogger('COMBAT', 0xff1010)

export default class CombatManager extends BaseClass {
  scene: Scene

  landSpeedInfoMap: { [entityId: number]: [number, number, number] }

  constructor(scene: Scene) {
    super()

    this.scene = scene

    this.landSpeedInfoMap = {}

    super.initHandlers(this)
  }

  private async takeFallDamage(entity: Entity, speedInfo: [number, number, number], plungeFall: boolean, seqId: number): Promise<void> {
    const { index, sign, threshold, multiplier } = fallDamageConfig[plungeFall ? 'plunge' : 'fall']
    const speed = speedInfo[index] * sign

    let mul: number = null
    for (let i = 0; i < threshold.length; i++) {
      if (speed >= threshold[i]) continue
      mul = multiplier[i]
      break
    }

    if (mul == null) return

    logger.debug('message.combat.debug.fall', index, speed, mul)

    const damage = entity.getProp(FightPropEnum.FIGHT_PROP_MAX_HP) * mul
    await entity.takeDamage(0, damage, true, ChangeHpReasonEnum.CHANGE_HP_SUB_FALL, seqId)
  }

  /**Events**/

  // CombatInvoke
  async handleCombatInvoke(context: PacketContext, entry: CombatInvokeEntry) {
    const { player, seqId } = context
    const { argumentType, combatData } = entry
    const argType = CombatTypeArgumentEnum[argumentType]
    const buf = Buffer.from(combatData, 'base64')
    const proto = protoLookupTable[argType]

    player?.forwardBuffer?.addEntry(CombatInvocations, entry, seqId)

    if (proto == null) {
      if (argumentType !== CombatTypeArgumentEnum.COMBAT_NONE) {
        logger.warn('message.combat.warn.noProto', argumentType, argType, buf.toString('base64'))
      }
      return
    }

    logger.verbose('generic.param1', argType)

    await this.emit(
      argType.replace(/(?<=(^|_)[A-Z]).*?(?=($|_))/g, v => v.toLowerCase()).replace(/_/g, ''),
      context,
      await dataToProtobuffer(buf, proto),
      buf
    )
  }

  /**Combat Events**/

  // CombatAnimatorParameterChanged

  // CombatAnimatorStateChanged

  // CombatEvtBeingHit
  async handleCombatEvtBeingHit(context: PacketContext, data: EvtBeingHitInfo) {
    const { player, seqId } = context
    const { currentScene } = player
    if (!currentScene) return

    const { entityManager } = currentScene
    const { attackResult } = data
    const { attackerId, defenseId, damage } = attackResult

    const attacker = entityManager.getEntity(attackerId, true)
    const target = entityManager.getEntity(defenseId, true)
    if (!target || !target.isAlive()) return

    let reason: ChangeHpReasonEnum = ChangeHpReasonEnum.CHANGE_HP_SUB_ENVIR
    if (attacker) {
      switch (attacker.protEntityType) {
        case ProtEntityTypeEnum.PROT_ENTITY_AVATAR:
          reason = ChangeHpReasonEnum.CHANGE_HP_SUB_AVATAR
          break
        case ProtEntityTypeEnum.PROT_ENTITY_MONSTER:
          reason = ChangeHpReasonEnum.CHANGE_HP_SUB_MONSTER
          break
      }
    }

    // Take attack damage
    await target.takeDamage(attackerId, damage, true, reason, seqId)
  }

  // CombatForceSetPosInfo

  // CombatSetAttackTarget

  // EntityMove
  async handleEntityMove(context: PacketContext, data: EntityMoveInfo) {
    const { landSpeedInfoMap } = this
    const { player, seqId } = context
    const { state, currentScene } = player
    const { entityId, motionInfo, sceneTime, reliableSeq } = data
    const { state: motionState, speed, params } = motionInfo

    if ((state & 0xF000) !== ClientStateEnum.IN_GAME) return

    const { entityManager } = currentScene
    const entity = entityManager.getEntity(entityId, true)
    if (!entity) return

    // Update entity motion info
    entity.motion.update(motionInfo, sceneTime, reliableSeq)

    if (entity.motion.pos.grid.hasChanged()) await entityManager.updateEntity(entity)

    switch (motionState) {
      // Save landing speed
      case MotionStateEnum.MOTION_LAND_SPEED: {
        landSpeedInfoMap[entityId] = [speed.y, params[0]?.x || 0, Date.now()]
        break
      }

      // Take fall damage
      case MotionStateEnum.MOTION_FALL_ON_GROUND:
      case MotionStateEnum.MOTION_FIGHT: {
        const speedInfo = landSpeedInfoMap[entityId]
        if (speedInfo != null) delete landSpeedInfoMap[entityId]
        if (speedInfo == null || Date.now() - speedInfo[2] > 500) break

        await this.takeFallDamage(entity, speedInfo, motionState === MotionStateEnum.MOTION_FIGHT, seqId)
        break
      }
    }
  }
}