import ByAnimatorBool from './Child/ByAnimatorBool'
import ByAnimatorFloat from './Child/ByAnimatorFloat'
import ByAnimatorInt from './Child/ByAnimatorInt'
import ByAny from './Child/ByAny'
import ByAttackNotHitScene from './Child/ByAttackNotHitScene'
import ByAttackTags from './Child/ByAttackTags'
import ByAttackType from './Child/ByAttackType'
import ByAvatarBodyType from './Child/ByAvatarBodyType'
import ByAvatarElementType from './Child/ByAvatarElementType'
import ByAvatarInWaterDepth from './Child/ByAvatarInWaterDepth'
import ByAvatarWeaponType from './Child/ByAvatarWeaponType'
import ByBigTeamBodyTypeSort from './Child/ByBigTeamBodyTypeSort'
import ByBigTeamElementTypeSort from './Child/ByBigTeamElementTypeSort'
import ByBigTeamHasBodyType from './Child/ByBigTeamHasBodyType'
import ByBigTeamHasElementType from './Child/ByBigTeamHasElementType'
import ByBigTeamHasFeatureTag from './Child/ByBigTeamHasFeatureTag'
import ByBigTeamHasWeaponType from './Child/ByBigTeamHasWeaponType'
import ByBigTeamWeaponTypeSort from './Child/ByBigTeamWeaponTypeSort'
import ByCompareWithTarget from './Child/ByCompareWithTarget'
import ByConductive from './Child/ByConductive'
import ByCurrentSceneId from './Child/ByCurrentSceneId'
import ByCurrentSceneTypes from './Child/ByCurrentSceneTypes'
import ByCurTeamBodyTypeSort from './Child/ByCurTeamBodyTypeSort'
import ByCurTeamElementTypeSort from './Child/ByCurTeamElementTypeSort'
import ByCurTeamHasBodyType from './Child/ByCurTeamHasBodyType'
import ByCurTeamHasElementType from './Child/ByCurTeamHasElementType'
import ByCurTeamHasFeatureTag from './Child/ByCurTeamHasFeatureTag'
import ByCurTeamHasWeaponType from './Child/ByCurTeamHasWeaponType'
import ByCurTeamWeaponTypeSort from './Child/ByCurTeamWeaponTypeSort'
import ByDieStateFlag from './Child/ByDieStateFlag'
import ByElementReactionSourceType from './Child/ByElementReactionSourceType'
import ByElementReactionType from './Child/ByElementReactionType'
import ByElementTriggerEntityType from './Child/ByElementTriggerEntityType'
import ByEnergyRatio from './Child/ByEnergyRatio'
import ByEntityAppearVisionType from './Child/ByEntityAppearVisionType'
import ByEntityIsAlive from './Child/ByEntityIsAlive'
import ByEntityTypes from './Child/ByEntityTypes'
import ByEquipAffixReady from './Child/ByEquipAffixReady'
import ByGameTimeIsLocked from './Child/ByGameTimeIsLocked'
import ByGlobalPosToGround from './Child/ByGlobalPosToGround'
import ByHasAbilityState from './Child/ByHasAbilityState'
import ByHasAttackTarget from './Child/ByHasAttackTarget'
import ByHasChildGadget from './Child/ByHasChildGadget'
import ByHasComponentTag from './Child/ByHasComponentTag'
import ByHasElement from './Child/ByHasElement'
import ByHasFeatureTag from './Child/ByHasFeatureTag'
import ByHasShield from './Child/ByHasShield'
import ByHasTag from './Child/ByHasTag'
import ByHitBoxName from './Child/ByHitBoxName'
import ByHitBoxType from './Child/ByHitBoxType'
import ByHitCritical from './Child/ByHitCritical'
import ByHitDamage from './Child/ByHitDamage'
import ByHitElement from './Child/ByHitElement'
import ByHitElementDurability from './Child/ByHitElementDurability'
import ByHitEnBreak from './Child/ByHitEnBreak'
import ByHitImpulse from './Child/ByHitImpulse'
import ByHitStrikeType from './Child/ByHitStrikeType'
import ByIsCombat from './Child/ByIsCombat'
import ByIsGadgetExistAround from './Child/ByIsGadgetExistAround'
import ByIsLocalAvatar from './Child/ByIsLocalAvatar'
import ByIsMoveOnWater from './Child/ByIsMoveOnWater'
import ByIsTargetCamp from './Child/ByIsTargetCamp'
import ByItemNumber from './Child/ByItemNumber'
import ByLocalAvatarStamina from './Child/ByLocalAvatarStamina'
import ByLocalAvatarStaminaRatio from './Child/ByLocalAvatarStaminaRatio'
import ByMonsterAirState from './Child/ByMonsterAirState'
import ByNot from './Child/ByNot'
import ByScenePropState from './Child/ByScenePropState'
import BySceneSurfaceType from './Child/BySceneSurfaceType'
import BySelfForwardAndTargetPosition from './Child/BySelfForwardAndTargetPosition'
import BySkillReady from './Child/BySkillReady'
import ByStageIsReadyTemp from './Child/ByStageIsReadyTemp'
import BySummonTagValue from './Child/BySummonTagValue'
import ByTargetAltitude from './Child/ByTargetAltitude'
import ByTargetConfigID from './Child/ByTargetConfigID'
import ByTargetElement from './Child/ByTargetElement'
import ByTargetForwardAndSelfPosition from './Child/ByTargetForwardAndSelfPosition'
import ByTargetGadgetState from './Child/ByTargetGadgetState'
import ByTargetGlobalValue from './Child/ByTargetGlobalValue'
import ByTargetHPRatio from './Child/ByTargetHPRatio'
import ByTargetHPValue from './Child/ByTargetHPValue'
import ByTargetIsCaster from './Child/ByTargetIsCaster'
import ByTargetIsGhostToEnemy from './Child/ByTargetIsGhostToEnemy'
import ByTargetIsSelf from './Child/ByTargetIsSelf'
import ByTargetLayoutArea from './Child/ByTargetLayoutArea'
import ByTargetOverrideMapValue from './Child/ByTargetOverrideMapValue'
import ByTargetPositionToSelfPosition from './Child/ByTargetPositionToSelfPosition'
import ByTargetRaycastVisiable from './Child/ByTargetRaycastVisiable'
import ByTargetType from './Child/ByTargetType'
import ByTargetWeight from './Child/ByTargetWeight'
import ByUnlockTalentParam from './Child/ByUnlockTalentParam'
import ByWetHitCollider from './Child/ByWetHitCollider'

type ConfigAbilityPredicate =
  ByAnimatorBool |
  ByAnimatorFloat |
  ByAnimatorInt |
  ByAny |
  ByAttackNotHitScene |
  ByAttackTags |
  ByAttackType |
  ByAvatarBodyType |
  ByAvatarElementType |
  ByAvatarInWaterDepth |
  ByAvatarWeaponType |
  ByBigTeamBodyTypeSort |
  ByBigTeamElementTypeSort |
  ByBigTeamHasBodyType |
  ByBigTeamHasElementType |
  ByBigTeamHasFeatureTag |
  ByBigTeamHasWeaponType |
  ByBigTeamWeaponTypeSort |
  ByCompareWithTarget |
  ByConductive |
  ByCurrentSceneId |
  ByCurrentSceneTypes |
  ByCurTeamBodyTypeSort |
  ByCurTeamElementTypeSort |
  ByCurTeamHasBodyType |
  ByCurTeamHasElementType |
  ByCurTeamHasFeatureTag |
  ByCurTeamHasWeaponType |
  ByCurTeamWeaponTypeSort |
  ByDieStateFlag |
  ByElementReactionSourceType |
  ByElementReactionType |
  ByElementTriggerEntityType |
  ByEnergyRatio |
  ByEntityAppearVisionType |
  ByEntityIsAlive |
  ByEntityTypes |
  ByEquipAffixReady |
  ByGameTimeIsLocked |
  ByGlobalPosToGround |
  ByHasAbilityState |
  ByHasAttackTarget |
  ByHasChildGadget |
  ByHasComponentTag |
  ByHasElement |
  ByHasFeatureTag |
  ByHasShield |
  ByHasTag |
  ByHitBoxName |
  ByHitBoxType |
  ByHitCritical |
  ByHitDamage |
  ByHitElement |
  ByHitElementDurability |
  ByHitEnBreak |
  ByHitImpulse |
  ByHitStrikeType |
  ByIsCombat |
  ByIsGadgetExistAround |
  ByIsLocalAvatar |
  ByIsMoveOnWater |
  ByIsTargetCamp |
  ByItemNumber |
  ByLocalAvatarStamina |
  ByLocalAvatarStaminaRatio |
  ByMonsterAirState |
  ByNot |
  ByScenePropState |
  BySceneSurfaceType |
  BySelfForwardAndTargetPosition |
  BySkillReady |
  ByStageIsReadyTemp |
  BySummonTagValue |
  ByTargetAltitude |
  ByTargetConfigID |
  ByTargetElement |
  ByTargetForwardAndSelfPosition |
  ByTargetGadgetState |
  ByTargetGlobalValue |
  ByTargetHPRatio |
  ByTargetHPValue |
  ByTargetIsCaster |
  ByTargetIsGhostToEnemy |
  ByTargetIsSelf |
  ByTargetLayoutArea |
  ByTargetOverrideMapValue |
  ByTargetPositionToSelfPosition |
  ByTargetRaycastVisiable |
  ByTargetType |
  ByTargetWeight |
  ByUnlockTalentParam |
  ByWetHitCollider

export default ConfigAbilityPredicate