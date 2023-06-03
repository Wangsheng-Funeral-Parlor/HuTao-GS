import { AvatarExpeditionStateEnum, AvatarTypeEnum, LifeStateEnum } from "./enum"

import { AvatarEquipAffixInfo, AvatarExcelInfo, AvatarFetterInfo, AvatarSkillInfo, PropValue, TrialAvatarInfo } from "."

export interface AvatarInfo {
  avatarId?: number
  guid?: string
  propMap?: { [type: number]: PropValue }
  lifeState?: LifeStateEnum
  equipGuidList?: string[]
  talentIdList?: number[]
  fightPropMap?: { [id: number]: number }
  trialAvatarInfo?: TrialAvatarInfo
  skillMap?: { [id: number]: AvatarSkillInfo }
  skillDepotId?: number
  fetterInfo?: AvatarFetterInfo
  coreProudSkillLevel?: number
  inherentProudSkillList?: number[]
  skillLevelMap?: { [id: number]: number }
  expeditionState?: AvatarExpeditionStateEnum
  proudSkillExtraLevelMap?: { [id: number]: number }
  isFocus?: boolean
  avatarType?: AvatarTypeEnum
  teamResonanceList?: number[]
  wearingFlycloakId?: number
  equipAffixList?: AvatarEquipAffixInfo[]
  bornTime?: number
  pendingPromoteRewardList?: number[]
  costumeId?: number
  excelInfo?: AvatarExcelInfo
  animHash?: number
}
