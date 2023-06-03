import Player from "."

import BaseClass from "#/baseClass"
import Avatar from "$/entity/avatar"
import MaterialData from "$/gameData/data/MaterialData"
import { Birthday, ProfilePicture, SocialShowAvatarInfo } from "@/types/proto"
import ProfileUserData from "@/types/user/ProfileUserData"

export default class Profile extends BaseClass {
  player: Player
  nickname: string
  signature: string
  birthday: Birthday
  nameCardId: number
  showAvatarList: Avatar[]
  showNameCardIdList: number[]
  unlockedNameCardIdList: number[]
  profilePicture: ProfilePicture
  isShowAvatar: boolean

  constructor(player: Player) {
    super()

    this.player = player

    this.showAvatarList = []
    this.showNameCardIdList = []
    this.unlockedNameCardIdList = []
    this.profilePicture = { avatarId: null }

    super.initHandlers(player)
  }

  async init(userData: ProfileUserData) {
    const { avatarList } = this.player
    const {
      nickname,
      signature,
      birthday,
      nameCardId,
      showAvatarList,
      showNameCardIdList,
      unlockedNameCardIdList,
      profilePicture,
      isShowAvatar,
    } = userData

    this.nickname = nickname || "Player"
    this.signature = signature || ""
    this.birthday = birthday || { month: 0, day: 0 }
    this.nameCardId = nameCardId || 210001
    this.showAvatarList = (Array.isArray(showAvatarList) ? showAvatarList : [])
      .map((id) => avatarList.find((avatar) => avatar.avatarId === id))
      .filter((avatar) => avatar != null)
    this.showNameCardIdList = Array.isArray(showNameCardIdList) ? showNameCardIdList : []
    this.unlockedNameCardIdList = Array.isArray(unlockedNameCardIdList) ? unlockedNameCardIdList : []
    this.profilePicture = profilePicture || { avatarId: null }
    this.isShowAvatar = !!isShowAvatar

    // unlock all new namecards
    await this.unlockAllNamecards()
  }

  async initNew(avatarId: number, nickName: string) {
    this.nickname = nickName
    this.signature = ""
    this.nameCardId = 210001

    this.profilePicture = { avatarId }

    this.birthday = { month: 0, day: 0 }

    this.showAvatarList = []
    this.showNameCardIdList = []
    this.isShowAvatar = false

    // unlock all namecards
    await this.unlockAllNamecards()
  }

  destroy() {
    delete this.player
    delete this.nickname
    delete this.signature
    delete this.birthday
    delete this.nameCardId
    delete this.showAvatarList
    delete this.showNameCardIdList
    delete this.unlockedNameCardIdList
    delete this.profilePicture
    delete this.isShowAvatar

    this.unregisterHandlers()
  }

  async unlockAllNamecards() {
    const { unlockedNameCardIdList } = this
    const newNamecards = (await MaterialData.getMaterialList())
      .filter((data) => data.MaterialType === "MATERIAL_NAMECARD" && !unlockedNameCardIdList.includes(data.Id))
      .map((data) => data.Id)

    if (newNamecards.length === 0) return

    // Add new namecards to namecard list
    unlockedNameCardIdList.push(...newNamecards)
  }

  setShowAvatarInfo(avatarIdList: number[], isShowAvatar = false) {
    const { player, showAvatarList } = this
    const { avatarList } = player

    while (showAvatarList.length > 0) showAvatarList.shift()

    for (const id of avatarIdList) {
      const avatar = avatarList.find((a) => a.avatarId === id)
      if (!avatar) continue

      showAvatarList.push(avatar)
    }

    this.isShowAvatar = isShowAvatar
  }

  exportShowAvatarInfoList(): SocialShowAvatarInfo[] {
    return this.showAvatarList.map((avatar) =>
      avatar.costumeId == null
        ? {
            avatarId: avatar.avatarId,
            level: avatar.level,
          }
        : {
            avatarId: avatar.avatarId,
            level: avatar.level,
            costumeId: avatar.costumeId,
          }
    )
  }

  exportUserData(): ProfileUserData {
    const {
      nickname,
      signature,
      birthday,
      nameCardId,
      showAvatarList,
      showNameCardIdList,
      unlockedNameCardIdList,
      profilePicture,
      isShowAvatar,
    } = this

    return {
      nickname,
      signature,
      birthday,
      nameCardId,
      showAvatarList: showAvatarList.map((avatar) => avatar.avatarId),
      showNameCardIdList,
      unlockedNameCardIdList,
      profilePicture,
      isShowAvatar,
    }
  }
}
