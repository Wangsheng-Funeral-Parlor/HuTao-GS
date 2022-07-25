import { Birthday, ProfilePicture } from '../proto'

export default interface ProfileUserData {
  nickname: string
  signature: string
  birthday: Birthday
  nameCardId: number
  showAvatarList: number[]
  showNameCardIdList: number[]
  unlockedNameCardIdList: number[]
  profilePicture: ProfilePicture
  isShowAvatar: boolean
}