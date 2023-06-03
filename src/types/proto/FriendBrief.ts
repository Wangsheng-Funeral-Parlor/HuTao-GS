import { FriendEnterHomeOptionEnum, FriendOnlineStateEnum, PlatformTypeEnum } from "./enum"

import { ProfilePicture, SocialShowAvatarInfo } from "."

export interface FriendBrief {
  uid: number
  nickname: string
  level: number
  avatarId?: number
  worldLevel: number
  signature: string
  onlineState: FriendOnlineStateEnum
  param?: number
  isMpModeAvailable?: boolean
  onlineId?: string
  lastActiveTime: number
  nameCardId: number
  mpPlayerNum?: number
  isChatNoDisturb?: boolean
  chatSequence?: number
  remarkName?: string
  showAvatarInfoList: SocialShowAvatarInfo[]
  friendEnterHomeOption?: FriendEnterHomeOptionEnum
  profilePicture: ProfilePicture
  isGameSource?: boolean
  isPsnSource?: boolean
  platformType: PlatformTypeEnum
}
