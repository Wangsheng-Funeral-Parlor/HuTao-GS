import Entity from '$/entity'
import Avatar from '$/entity/avatar'
import AbilityManager from '$/manager/abilityManager'
import ConfigAbilityPredicate from '$DT/BinOutput/Config/ConfigAbility/Predicate'
import {
  ByAnimatorBool,
  ByAnimatorFloat,
  ByAnimatorInt,
  ByAny,
  ByAttackNotHitScene,
  ByAttackTags,
  ByAttackType,
  ByAvatarBodyType,
  ByAvatarElementType,
  ByAvatarInWaterDepth,
  ByAvatarWeaponType,
  ByBigTeamBodyTypeSort,
  ByBigTeamElementTypeSort,
  ByBigTeamHasBodyType,
  ByBigTeamHasElementType,
  ByBigTeamHasFeatureTag,
  ByBigTeamHasWeaponType,
  ByBigTeamWeaponTypeSort,
  ByCompareWithTarget,
  ByConductive,
  ByCurrentSceneId,
  ByCurrentSceneTypes,
  ByCurTeamBodyTypeSort,
  ByCurTeamElementTypeSort,
  ByCurTeamHasBodyType,
  ByCurTeamHasElementType,
  ByCurTeamHasFeatureTag,
  ByCurTeamHasWeaponType,
  ByCurTeamWeaponTypeSort,
  ByDieStateFlag,
  ByElementReactionSourceType,
  ByElementReactionType,
  ByElementTriggerEntityType,
  ByEnergyRatio,
  ByEntityAppearVisionType,
  ByEntityIsAlive,
  ByEntityTypes,
  ByEquipAffixReady,
  ByGameTimeIsLocked,
  ByGlobalPosToGround,
  ByHasAbilityState,
  ByHasAttackTarget,
  ByHasChildGadget,
  ByHasComponentTag,
  ByHasElement,
  ByHasFeatureTag,
  ByHasShield,
  ByHasTag,
  ByHitBoxName,
  ByHitBoxType,
  ByHitCritical,
  ByHitDamage,
  ByHitElement,
  ByHitElementDurability,
  ByHitEnBreak,
  ByHitImpulse,
  ByHitStrikeType,
  ByIsCombat,
  ByIsGadgetExistAround,
  ByIsLocalAvatar,
  ByIsMoveOnWater,
  ByIsTargetCamp,
  ByItemNumber,
  ByLocalAvatarStamina,
  ByLocalAvatarStaminaRatio,
  ByMonsterAirState,
  ByNot,
  ByScenePropState,
  BySceneSurfaceType,
  BySelfForwardAndTargetPosition,
  BySkillReady,
  ByStageIsReadyTemp,
  BySummonTagValue,
  ByTargetAltitude,
  ByTargetConfigID,
  ByTargetElement,
  ByTargetForwardAndSelfPosition,
  ByTargetGadgetState,
  ByTargetGlobalValue,
  ByTargetHPRatio,
  ByTargetHPValue,
  ByTargetIsCaster,
  ByTargetIsGhostToEnemy,
  ByTargetIsSelf,
  ByTargetLayoutArea,
  ByTargetOverrideMapValue,
  ByTargetPositionToSelfPosition,
  ByTargetRaycastVisiable,
  ByTargetType,
  ByTargetWeight,
  ByUnlockTalentParam,
  ByWetHitCollider
} from '$DT/BinOutput/Config/ConfigAbility/Predicate/Child'
import { EntityTypeEnum, RelationTypeEnum } from '@/types/enum'
import { AbilityString } from '@/types/proto'
import { getStringHash } from '@/utils/hash'
import AbilityScalarValueContainer from './abilityScalarValueContainer'
import AppliedAbility from './appliedAbility'

export default class AbilityPredicate {
  manager: AbilityManager

  constructor(manager: AbilityManager) {
    this.manager = manager
  }

  private getCaster(ability: AppliedAbility): Entity | null {
    const { manager } = ability
    const { utils } = manager
    return utils.getCaster()
  }

  private getTargetEntity(ability: AppliedAbility, predicate: ConfigAbilityPredicate, target: Entity): Entity | null {
    const { manager } = ability
    const { utils } = manager
    return utils.getTargetList(ability, predicate, target)[0]
  }

  private compare(type: RelationTypeEnum, container: AbilityScalarValueContainer, key: AbilityString, val: number, maxVal: number = 0): boolean {
    const entry = container.getValue(key)
    const entryVal = entry?.val || 0

    switch (type || RelationTypeEnum.Equal) {
      case RelationTypeEnum.Equal:
        return entryVal === val
      case RelationTypeEnum.MoreThan:
        return entryVal > val
      case RelationTypeEnum.LessAndEqual:
        return entryVal <= val
      case RelationTypeEnum.Between:
        return entryVal >= val && entryVal <= maxVal
      case RelationTypeEnum.MoreThanAndEqual:
        return entryVal >= val
      case RelationTypeEnum.NoneOrEqual:
        return entry == null || entryVal === val
      default:
        return false
    }
  }

  check(ability: AppliedAbility, predicate: ConfigAbilityPredicate, target: Entity): boolean {
    const { $type } = predicate
    const checkFunc = <(ability: AppliedAbility, predicate: ConfigAbilityPredicate, target: Entity) => boolean>this[`check${$type}`]
    if (typeof checkFunc !== 'function') return true
    return checkFunc.call(this, ability, predicate, target)
  }

  checkAll(ability: AppliedAbility, predicates: ConfigAbilityPredicate[], target: Entity): boolean {
    if (!Array.isArray(predicates)) return true

    for (const predicate of predicates) {
      if (!this.check(ability, predicate, target)) return false
    }

    return true
  }

  /**Predicates**/

  // ByAnimatorBool
  private checkByAnimatorBool(_ability: AppliedAbility, _predicate: ByAnimatorBool, _target: Entity): boolean {
    return false
  }

  // ByAnimatorFloat
  private checkByAnimatorFloat(_ability: AppliedAbility, _predicate: ByAnimatorFloat, _target: Entity): boolean {
    return false
  }

  // ByAnimatorInt
  private checkByAnimatorInt(_ability: AppliedAbility, _predicate: ByAnimatorInt, _target: Entity): boolean {
    return false
  }

  // ByAny
  private checkByAny(ability: AppliedAbility, predicate: ByAny, target: Entity): boolean {
    const { Predicates } = predicate
    if (!Array.isArray(Predicates)) return false

    for (const p of Predicates) {
      if (this.check(ability, p, target)) return true
    }

    return false
  }

  // ByAttackNotHitScene
  private checkByAttackNotHitScene(_ability: AppliedAbility, _predicate: ByAttackNotHitScene, _target: Entity): boolean {
    return false
  }

  // ByAttackTags
  private checkByAttackTags(_ability: AppliedAbility, _predicate: ByAttackTags, _target: Entity): boolean {
    return false
  }

  // ByAttackType
  private checkByAttackType(_ability: AppliedAbility, _predicate: ByAttackType, _target: Entity): boolean {
    return false
  }

  // ByAvatarBodyType
  private checkByAvatarBodyType(_ability: AppliedAbility, _predicate: ByAvatarBodyType, _target: Entity): boolean {
    return false
  }

  // ByAvatarElementType
  private checkByAvatarElementType(_ability: AppliedAbility, _predicate: ByAvatarElementType, _target: Entity): boolean {
    return false
  }

  // ByAvatarInWaterDepth
  private checkByAvatarInWaterDepth(_ability: AppliedAbility, _predicate: ByAvatarInWaterDepth, _target: Entity): boolean {
    return false
  }

  // ByAvatarWeaponType
  private checkByAvatarWeaponType(_ability: AppliedAbility, _predicate: ByAvatarWeaponType, _target: Entity): boolean {
    return false
  }

  // ByBigTeamBodyTypeSort
  private checkByBigTeamBodyTypeSort(_ability: AppliedAbility, _predicate: ByBigTeamBodyTypeSort, _target: Entity): boolean {
    return false
  }

  // ByBigTeamElementTypeSort
  private checkByBigTeamElementTypeSort(_ability: AppliedAbility, _predicate: ByBigTeamElementTypeSort, _target: Entity): boolean {
    return false
  }

  // ByBigTeamHasBodyType
  private checkByBigTeamHasBodyType(_ability: AppliedAbility, _predicate: ByBigTeamHasBodyType, _target: Entity): boolean {
    return false
  }

  // ByBigTeamHasElementType
  private checkByBigTeamHasElementType(_ability: AppliedAbility, _predicate: ByBigTeamHasElementType, _target: Entity): boolean {
    return false
  }

  // ByBigTeamHasFeatureTag
  private checkByBigTeamHasFeatureTag(_ability: AppliedAbility, _predicate: ByBigTeamHasFeatureTag, _target: Entity): boolean {
    return false
  }

  // ByBigTeamHasWeaponType
  private checkByBigTeamHasWeaponType(_ability: AppliedAbility, _predicate: ByBigTeamHasWeaponType, _target: Entity): boolean {
    return false
  }

  // ByBigTeamWeaponTypeSort
  private checkByBigTeamWeaponTypeSort(_ability: AppliedAbility, _predicate: ByBigTeamWeaponTypeSort, _target: Entity): boolean {
    return false
  }

  // ByCompareWithTarget
  private checkByCompareWithTarget(_ability: AppliedAbility, _predicate: ByCompareWithTarget, _target: Entity): boolean {
    return false
  }

  // ByConductive
  private checkByConductive(_ability: AppliedAbility, _predicate: ByConductive, _target: Entity): boolean {
    return false
  }

  // ByCurrentSceneId
  private checkByCurrentSceneId(_ability: AppliedAbility, _predicate: ByCurrentSceneId, _target: Entity): boolean {
    return false
  }

  // ByCurrentSceneTypes
  private checkByCurrentSceneTypes(_ability: AppliedAbility, _predicate: ByCurrentSceneTypes, _target: Entity): boolean {
    return false
  }

  // ByCurTeamBodyTypeSort
  private checkByCurTeamBodyTypeSort(_ability: AppliedAbility, _predicate: ByCurTeamBodyTypeSort, _target: Entity): boolean {
    return false
  }

  // ByCurTeamElementTypeSort
  private checkByCurTeamElementTypeSort(_ability: AppliedAbility, _predicate: ByCurTeamElementTypeSort, _target: Entity): boolean {
    return false
  }

  // ByCurTeamHasBodyType
  private checkByCurTeamHasBodyType(_ability: AppliedAbility, _predicate: ByCurTeamHasBodyType, _target: Entity): boolean {
    return false
  }

  // ByCurTeamHasElementType
  private checkByCurTeamHasElementType(_ability: AppliedAbility, _predicate: ByCurTeamHasElementType, _target: Entity): boolean {
    return false
  }

  // ByCurTeamHasFeatureTag
  private checkByCurTeamHasFeatureTag(_ability: AppliedAbility, _predicate: ByCurTeamHasFeatureTag, _target: Entity): boolean {
    return false
  }

  // ByCurTeamHasWeaponType
  private checkByCurTeamHasWeaponType(_ability: AppliedAbility, _predicate: ByCurTeamHasWeaponType, _target: Entity): boolean {
    return false
  }

  // ByCurTeamWeaponTypeSort
  private checkByCurTeamWeaponTypeSort(_ability: AppliedAbility, _predicate: ByCurTeamWeaponTypeSort, _target: Entity): boolean {
    return false
  }

  // ByDieStateFlag
  private checkByDieStateFlag(_ability: AppliedAbility, _predicate: ByDieStateFlag, _target: Entity): boolean {
    return false
  }

  // ByElementReactionSourceType
  private checkByElementReactionSourceType(_ability: AppliedAbility, _predicate: ByElementReactionSourceType, _target: Entity): boolean {
    return false
  }

  // ByElementReactionType
  private checkByElementReactionType(_ability: AppliedAbility, _predicate: ByElementReactionType, _target: Entity): boolean {
    return false
  }

  // ByElementTriggerEntityType
  private checkByElementTriggerEntityType(_ability: AppliedAbility, _predicate: ByElementTriggerEntityType, _target: Entity): boolean {
    return false
  }

  // ByEnergyRatio
  private checkByEnergyRatio(_ability: AppliedAbility, _predicate: ByEnergyRatio, _target: Entity): boolean {
    return false
  }

  // ByEntityAppearVisionType
  private checkByEntityAppearVisionType(_ability: AppliedAbility, _predicate: ByEntityAppearVisionType, _target: Entity): boolean {
    return false
  }

  // ByEntityIsAlive
  private checkByEntityIsAlive(_ability: AppliedAbility, _predicate: ByEntityIsAlive, target: Entity): boolean {
    return target?.isAlive() || false
  }

  // ByEntityTypes
  private checkByEntityTypes(ability: AppliedAbility, predicate: ByEntityTypes, target: Entity): boolean {
    const { EntityTypes } = predicate

    const targetEntity = this.getTargetEntity(ability, predicate, target)
    if (targetEntity == null || !Array.isArray(EntityTypes)) return false

    const { entityType } = target
    return EntityTypes.includes(EntityTypeEnum[entityType])
  }

  // ByEquipAffixReady
  private checkByEquipAffixReady(_ability: AppliedAbility, _predicate: ByEquipAffixReady, _target: Entity): boolean {
    return false
  }

  // ByGameTimeIsLocked
  private checkByGameTimeIsLocked(_ability: AppliedAbility, _predicate: ByGameTimeIsLocked, _target: Entity): boolean {
    return false
  }

  // ByGlobalPosToGround
  private checkByGlobalPosToGround(_ability: AppliedAbility, _predicate: ByGlobalPosToGround, _target: Entity): boolean {
    return false
  }

  // ByHasAbilityState
  private checkByHasAbilityState(_ability: AppliedAbility, _predicate: ByHasAbilityState, _target: Entity): boolean {
    return false
  }

  // ByHasAttackTarget
  private checkByHasAttackTarget(_ability: AppliedAbility, _predicate: ByHasAttackTarget, _target: Entity): boolean {
    return false
  }

  // ByHasChildGadget
  private checkByHasChildGadget(_ability: AppliedAbility, _predicate: ByHasChildGadget, _target: Entity): boolean {
    return false
  }

  // ByHasComponentTag
  private checkByHasComponentTag(_ability: AppliedAbility, _predicate: ByHasComponentTag, _target: Entity): boolean {
    return false
  }

  // ByHasElement
  private checkByHasElement(_ability: AppliedAbility, _predicate: ByHasElement, _target: Entity): boolean {
    return false
  }

  // ByHasFeatureTag
  private checkByHasFeatureTag(_ability: AppliedAbility, _predicate: ByHasFeatureTag, _target: Entity): boolean {
    return false
  }

  // ByHasShield
  private checkByHasShield(_ability: AppliedAbility, _predicate: ByHasShield, _target: Entity): boolean {
    return false
  }

  // ByHasTag
  private checkByHasTag(_ability: AppliedAbility, _predicate: ByHasTag, _target: Entity): boolean {
    return false
  }

  // ByHitBoxName
  private checkByHitBoxName(_ability: AppliedAbility, _predicate: ByHitBoxName, _target: Entity): boolean {
    return false
  }

  // ByHitBoxType
  private checkByHitBoxType(_ability: AppliedAbility, _predicate: ByHitBoxType, _target: Entity): boolean {
    return false
  }

  // ByHitCritical
  private checkByHitCritical(_ability: AppliedAbility, _predicate: ByHitCritical, _target: Entity): boolean {
    return false
  }

  // ByHitDamage
  private checkByHitDamage(_ability: AppliedAbility, _predicate: ByHitDamage, _target: Entity): boolean {
    return false
  }

  // ByHitElement
  private checkByHitElement(_ability: AppliedAbility, _predicate: ByHitElement, _target: Entity): boolean {
    return false
  }

  // ByHitElementDurability
  private checkByHitElementDurability(_ability: AppliedAbility, _predicate: ByHitElementDurability, _target: Entity): boolean {
    return false
  }

  // ByHitEnBreak
  private checkByHitEnBreak(_ability: AppliedAbility, _predicate: ByHitEnBreak, _target: Entity): boolean {
    return false
  }

  // ByHitImpulse
  private checkByHitImpulse(_ability: AppliedAbility, _predicate: ByHitImpulse, _target: Entity): boolean {
    return false
  }

  // ByHitStrikeType
  private checkByHitStrikeType(_ability: AppliedAbility, _predicate: ByHitStrikeType, _target: Entity): boolean {
    return false
  }

  // ByIsCombat
  private checkByIsCombat(_ability: AppliedAbility, _predicate: ByIsCombat, _target: Entity): boolean {
    return false
  }

  // ByIsGadgetExistAround
  private checkByIsGadgetExistAround(_ability: AppliedAbility, _predicate: ByIsGadgetExistAround, _target: Entity): boolean {
    return false
  }

  // ByIsLocalAvatar
  private checkByIsLocalAvatar(_ability: AppliedAbility, _predicate: ByIsLocalAvatar, _target: Entity): boolean {
    return false
  }

  // ByIsMoveOnWater
  private checkByIsMoveOnWater(_ability: AppliedAbility, _predicate: ByIsMoveOnWater, _target: Entity): boolean {
    return false
  }

  // ByIsTargetCamp
  private checkByIsTargetCamp(_ability: AppliedAbility, _predicate: ByIsTargetCamp, _target: Entity): boolean {
    return false
  }

  // ByItemNumber
  private checkByItemNumber(_ability: AppliedAbility, _predicate: ByItemNumber, _target: Entity): boolean {
    return false
  }

  // ByLocalAvatarStamina
  private checkByLocalAvatarStamina(_ability: AppliedAbility, _predicate: ByLocalAvatarStamina, _target: Entity): boolean {
    return false
  }

  // ByLocalAvatarStaminaRatio
  private checkByLocalAvatarStaminaRatio(_ability: AppliedAbility, _predicate: ByLocalAvatarStaminaRatio, _target: Entity): boolean {
    return false
  }

  // ByMonsterAirState
  private checkByMonsterAirState(_ability: AppliedAbility, _predicate: ByMonsterAirState, _target: Entity): boolean {
    return false
  }

  // ByNot
  private checkByNot(ability: AppliedAbility, predicate: ByNot, target: Entity): boolean {
    return !this.checkByAny(ability, { $type: 'ByAny', Predicates: predicate.Predicates }, target)
  }

  // ByScenePropState
  private checkByScenePropState(_ability: AppliedAbility, _predicate: ByScenePropState, _target: Entity): boolean {
    return false
  }

  // BySceneSurfaceType
  private checkBySceneSurfaceType(_ability: AppliedAbility, _predicate: BySceneSurfaceType, _target: Entity): boolean {
    return false
  }

  // BySelfForwardAndTargetPosition
  private checkBySelfForwardAndTargetPosition(_ability: AppliedAbility, _predicate: BySelfForwardAndTargetPosition, _target: Entity): boolean {
    return false
  }

  // BySkillReady
  private checkBySkillReady(ability: AppliedAbility, predicate: BySkillReady, target: Entity): boolean {
    const { SkillID } = predicate

    const targetEntity = <Avatar>this.getTargetEntity(ability, predicate, target)
    if (targetEntity?.entityType !== EntityTypeEnum.Avatar) return false

    const { skillManager } = targetEntity
    const { currentDepot } = skillManager
    return currentDepot?.getSkill(SkillID)?.isReady || false
  }

  // ByStageIsReadyTemp
  private checkByStageIsReadyTemp(_ability: AppliedAbility, _predicate: ByStageIsReadyTemp, _target: Entity): boolean {
    return false
  }

  // BySummonTagValue
  private checkBySummonTagValue(_ability: AppliedAbility, _predicate: BySummonTagValue, _target: Entity): boolean {
    return false
  }

  // ByTargetAltitude
  private checkByTargetAltitude(_ability: AppliedAbility, _predicate: ByTargetAltitude, _target: Entity): boolean {
    return false
  }

  // ByTargetConfigID
  private checkByTargetConfigID(_ability: AppliedAbility, _predicate: ByTargetConfigID, _target: Entity): boolean {
    return false
  }

  // ByTargetElement
  private checkByTargetElement(_ability: AppliedAbility, _predicate: ByTargetElement, _target: Entity): boolean {
    return false
  }

  // ByTargetForwardAndSelfPosition
  private checkByTargetForwardAndSelfPosition(_ability: AppliedAbility, _predicate: ByTargetForwardAndSelfPosition, _target: Entity): boolean {
    return false
  }

  // ByTargetGadgetState
  private checkByTargetGadgetState(_ability: AppliedAbility, _predicate: ByTargetGadgetState, _target: Entity): boolean {
    return false
  }

  // ByTargetGlobalValue
  private checkByTargetGlobalValue(ability: AppliedAbility, predicate: ByTargetGlobalValue, target: Entity): boolean {
    const { Key, Value, MaxValue, ForceByCaster, CompareType } = predicate

    const targetEntity = ForceByCaster ? this.getCaster(ability) : this.getTargetEntity(ability, predicate, target)
    if (targetEntity == null) return false

    const { abilityManager } = targetEntity
    if (abilityManager == null) return

    const { utils, dynamicValueMapContainer } = abilityManager

    const key = { hash: getStringHash(Key) }
    const val = utils.eval(ability, Value, 0)
    const maxVal = utils.eval(ability, MaxValue, 0)

    return this.compare(RelationTypeEnum[CompareType], dynamicValueMapContainer, key, val, maxVal)
  }

  // ByTargetHPRatio
  private checkByTargetHPRatio(_ability: AppliedAbility, _predicate: ByTargetHPRatio, _target: Entity): boolean {
    return false
  }

  // ByTargetHPValue
  private checkByTargetHPValue(_ability: AppliedAbility, _predicate: ByTargetHPValue, _target: Entity): boolean {
    return false
  }

  // ByTargetIsCaster
  private checkByTargetIsCaster(ability: AppliedAbility, predicate: ByTargetIsCaster, target: Entity): boolean {
    return this.getTargetEntity(ability, predicate, target) === this.getCaster(ability)
  }

  // ByTargetIsGhostToEnemy
  private checkByTargetIsGhostToEnemy(_ability: AppliedAbility, _predicate: ByTargetIsGhostToEnemy, _target: Entity): boolean {
    return false
  }

  // ByTargetIsSelf
  private checkByTargetIsSelf(ability: AppliedAbility, predicate: ByTargetIsSelf, target: Entity): boolean {
    const { manager } = ability
    const { entity } = manager
    return this.getTargetEntity(ability, predicate, target) === entity
  }

  // ByTargetLayoutArea
  private checkByTargetLayoutArea(_ability: AppliedAbility, _predicate: ByTargetLayoutArea, _target: Entity): boolean {
    return false
  }

  // ByTargetOverrideMapValue
  private checkByTargetOverrideMapValue(_ability: AppliedAbility, _predicate: ByTargetOverrideMapValue, _target: Entity): boolean {
    return false
  }

  // ByTargetPositionToSelfPosition
  private checkByTargetPositionToSelfPosition(_ability: AppliedAbility, _predicate: ByTargetPositionToSelfPosition, _target: Entity): boolean {
    return false
  }

  // ByTargetRaycastVisiable
  private checkByTargetRaycastVisiable(_ability: AppliedAbility, _predicate: ByTargetRaycastVisiable, _target: Entity): boolean {
    return false
  }

  // ByTargetType
  private checkByTargetType(_ability: AppliedAbility, _predicate: ByTargetType, _target: Entity): boolean {
    return false
  }

  // ByTargetWeight
  private checkByTargetWeight(_ability: AppliedAbility, _predicate: ByTargetWeight, _target: Entity): boolean {
    return false
  }

  // ByUnlockTalentParam
  private checkByUnlockTalentParam(ability: AppliedAbility, predicate: ByUnlockTalentParam, target: Entity): boolean {
    const { TalentParam } = predicate
    if (TalentParam == null) return false

    const targetEntity = <Avatar>this.getTargetEntity(ability, predicate, target)
    if (targetEntity?.entityType !== EntityTypeEnum.Avatar) return false

    return targetEntity.talentManager.unlockedTalents.find(t => t.name === TalentParam) != null
  }

  // ByWetHitCollider
  private checkByWetHitCollider(_ability: AppliedAbility, _predicate: ByWetHitCollider, _target: Entity): boolean {
    return false
  }
}