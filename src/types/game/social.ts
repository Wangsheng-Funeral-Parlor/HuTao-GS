import { PlatformTypeEnum } from '../enum/player'
import { FriendEnterHomeOptionEnum, FriendOnlineStateEnum } from '../enum/social'
import { Birthday, ProfilePicture } from './profile'

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

export interface SocialDetail {
  uid: number
  nickname: string
  level: number
  avatarId?: number
  signature: string
  birthday: Birthday
  worldLevel: number
  reservedList?: number[]
  onlineState?: FriendOnlineStateEnum
  param?: number
  isFriend?: boolean
  isMpModeAvailable?: boolean
  onlineId?: string
  nameCardId: number
  isInBlacklist?: boolean
  isChatNoDisturb?: boolean
  remarkName?: string
  finishAchievementNum: number
  towerFloorIndex: number
  towerLevelIndex: number
  isShowAvatar?: boolean
  showAvatarInfoList?: SocialShowAvatarInfo[]
  showNameCardIdList?: number[]
  friendEnterHomeOption?: FriendEnterHomeOptionEnum
  profilePicture: ProfilePicture
}

export interface SocialShowAvatarInfo {
  avatarId: number
  level: number
  costumeId?: number
}