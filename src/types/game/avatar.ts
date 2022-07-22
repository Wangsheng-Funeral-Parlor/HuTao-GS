import { AvatarExpeditionStateEnum, AvatarTypeEnum, FetterStateEnum, GrantReasonEnum } from '../enum/avatar'
import { LifeStateEnum } from '../enum/entity'
import { AbilitySyncStateInfo } from './ability'
import { ItemInterface } from './item'
import { PropValue } from './prop'
import { SceneReliquaryInfo } from './reliquary'
import { CurVehicleInfo } from './vehicle'
import { SceneWeaponInfo } from './weapon'

export interface AvatarEnterSceneInfo {
  avatarGuid: string
  avatarEntityId: number
  avatarAbilityInfo: AbilitySyncStateInfo
  buffIdList?: number[]
  weaponGuid: string
  weaponEntityId: number
  weaponAbilityInfo: AbilitySyncStateInfo
  serverBuffList?: ServerBuff[]
}

export interface AvatarEquipAffixInfo {
  equipAffixId: number
  leftCdTime: number
}

export interface AvatarExcelInfo {
  prefabPathHash: string
  prefabPathRemoteHash: string
  controllerPathHash: string
  controllerPathRemoteHash: string
  combatConfigHash: string
}

export interface AvatarFetterInfo {
  expNumber?: number
  expLevel: number
  openIdList?: number[]
  finishIdList?: number[]
  rewardedFetterLevelList?: number[]
  fetterList: FetterInfo[]
}

export interface AvatarInfo {
  avatarId: number
  guid: string
  propMap: { [type: number]: PropValue }
  lifeState: LifeStateEnum
  equipGuidList: string[]
  talentIdList: number[]
  fightPropMap: { [id: number]: number }
  trialAvatarInfo?: TrialAvatarInfo
  skillMap?: { [id: number]: AvatarSkillInfo }
  skillDepotId: number
  fetterInfo: AvatarFetterInfo
  coreProudSkillLevel?: number
  inherentProudSkillList: number[]
  skillLevelMap: { [id: number]: number }
  expeditionState?: AvatarExpeditionStateEnum
  proudSkillExtraLevelMap: { [id: number]: number }
  isFocus?: boolean
  avatarType: AvatarTypeEnum
  teamResonanceList?: number[]
  wearingFlycloakId: number
  equipAffixList?: AvatarEquipAffixInfo[]
  bornTime: number
  pendingPromoteRewardList?: number[]
  costumeId?: number
  excelInfo?: AvatarExcelInfo
  animHash?: number
}

export interface AvatarSatiationData {
  avatarGuid: string
  finishTime: number
  penaltyFinishTime: number
}

export interface AvatarSkillInfo {
  passCdTime: number
  fullCdTimeList: number[]
  maxChargeCount: number
}

export interface FetterInfo {
  fetterId: number
  fetterState: FetterStateEnum
  condIndexList?: number[]
}

export interface SceneAvatarInfo {
  uid: number
  avatarId: number
  guid: string
  peerId: number
  equipIdList: number[]
  skillDepotId: number
  talentIdList?: number[]
  weapon: SceneWeaponInfo
  reliquaryList: SceneReliquaryInfo[]
  coreProudSkillLevel?: number
  inherentProudSkillList: number[]
  skillLevelMap: { [id: number]: number }
  proudSkillExtraLevelMap?: { [id: number]: number }
  serverBuffList?: ServerBuff[]
  teamResonanceList: number[]
  wearingFlycloakId: number
  bornTime: number
  costumeId?: number
  curVehicleInfo?: CurVehicleInfo
  excelInfo?: AvatarExcelInfo
  animHash?: number
}

export interface ServerBuff {
  serverBuffUid: number
  serverBuffId: number
  serverBuffType: number
  instancedModifierId: number
  isModifierAdded: boolean
}

export interface TrialAvatarGrantRecord {
  grantReason: GrantReasonEnum
  fromParentQuestId: number
}

export interface TrialAvatarInfo {
  trialAvatarId: number
  trialEquipList: ItemInterface[]
  grantRecord: TrialAvatarGrantRecord
}