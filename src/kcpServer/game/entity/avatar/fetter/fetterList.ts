import Fetter from './fetter'
import Avatar from '..'
import { AvatarFetterInfo } from '@/types/game/avatar'
import AvatarData from '$/gameData/data/AvatarData'
import FettersUserData from '@/types/user/FettersUserData'

export default class FetterList {
  avatar: Avatar
  expLevel: number
  rewardedFetterLevelList: number[]
  fetterList: Fetter[]

  constructor(avatar: Avatar) {
    this.avatar = avatar

    this.fetterList = []

    this.update()
  }

  init(userData: FettersUserData) {
    const { fetterList } = this
    const { expLevel, rewarded } = userData

    this.expLevel = expLevel || 1
    this.rewardedFetterLevelList = Array.isArray(rewarded) ? rewarded : []

    for (let fetter of fetterList) fetter.update()
  }

  initNew() {
    const { fetterList } = this

    this.expLevel = 1
    this.rewardedFetterLevelList = []

    for (let fetter of fetterList) fetter.update()
  }

  update() {
    const { avatar, fetterList } = this

    const data = AvatarData.getAvatar(avatar.avatarId)
    if (!data) return

    fetterList.splice(0)
    fetterList.push(...data.Fetters.map(fetter => new Fetter(this, fetter)))
  }

  export(): AvatarFetterInfo {
    const { expLevel, rewardedFetterLevelList, fetterList } = this

    return {
      expLevel,
      rewardedFetterLevelList,
      fetterList: fetterList.map(f => f.export())
    }
  }

  exportUserData(): FettersUserData {
    const { expLevel, rewardedFetterLevelList } = this

    return {
      expLevel,
      rewarded: rewardedFetterLevelList
    }
  }
}