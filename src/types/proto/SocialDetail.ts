import { Birthday, ProfilePicture, SocialShowAvatarInfo } from '.'
import { FriendEnterHomeOptionEnum, FriendOnlineStateEnum } from './enum'

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