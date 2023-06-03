import { MpSettingTypeEnum } from "./enum"

import { ProfilePicture } from "."

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
