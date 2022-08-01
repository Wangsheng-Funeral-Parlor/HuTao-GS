import AvatarData from '$/gameData/data/AvatarData'
import { AvatarFetterInfo } from '@/types/proto'
import FettersUserData from '@/types/user/FettersUserData'
import Avatar from '..'
import Fetter from './fetter'

export default class FetterList {
  avatar: Avatar
  expLevel: number
  rewardedFetterLevelList: number[]
  fetterList: Fetter[]

  constructor(avatar: Avatar) {
    this.avatar = avatar

    this.fetterList = []
  }

  private async loadFetterData() {
    const avatarData = await AvatarData.getAvatar(this.avatar.avatarId)
    if (!avatarData) return

    this.fetterList = avatarData.Fetters.map(fetter => new Fetter(this, fetter))
  }

  async init(userData: FettersUserData) {
    await this.loadFetterData()

    const { fetterList } = this
    const { expLevel, rewarded } = userData

    this.expLevel = expLevel || 1
    this.rewardedFetterLevelList = Array.isArray(rewarded) ? rewarded : []

    for (const fetter of fetterList) fetter.update()
  }

  async initNew() {
    await this.loadFetterData()

    const { fetterList } = this

    this.expLevel = 1
    this.rewardedFetterLevelList = []

    for (const fetter of fetterList) fetter.update()
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