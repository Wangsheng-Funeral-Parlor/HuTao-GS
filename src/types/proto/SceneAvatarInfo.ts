import { AvatarExcelInfo, CurVehicleInfo, SceneReliquaryInfo, SceneWeaponInfo, ServerBuff } from '.'

export interface SceneAvatarInfo {
  uid?: number
  avatarId?: number
  guid?: string
  peerId?: number
  equipIdList?: number[]
  skillDepotId?: number
  talentIdList?: number[]
  weapon?: SceneWeaponInfo
  reliquaryList?: SceneReliquaryInfo[]
  coreProudSkillLevel?: number
  inherentProudSkillList?: number[]
  skillLevelMap?: { [id: number]: number }
  proudSkillExtraLevelMap?: { [id: number]: number }
  serverBuffList?: ServerBuff[]
  teamResonanceList?: number[]
  wearingFlycloakId?: number
  bornTime?: number
  costumeId?: number
  curVehicleInfo?: CurVehicleInfo
  excelInfo?: AvatarExcelInfo
  animHash?: number
}