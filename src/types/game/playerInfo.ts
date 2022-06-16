import { MpSettingTypeEnum } from '../enum/mp'
import { ProfilePicture } from './profile'

export interface OnlinePlayerInfo {
  uid: number
  nickname: string
  playerLevel: number
  avatarId?: number
  mpSettingType: MpSettingTypeEnum
  curPlayerNumInWorld: number
  worldLevel: number
  onlineId?: string
  nameCardId: number
  blacklistUidList?: number[]
  signature: string
  profilePicture: ProfilePicture
  psnId?: string
}

export interface ScenePlayerInfo {
  uid: number
  peerId: number
  name: string
  isConnected?: boolean
  sceneId: number
  onlinePlayerInfo: OnlinePlayerInfo
}