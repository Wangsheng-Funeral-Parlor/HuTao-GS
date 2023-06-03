import AvatarEquipChange from "#/packets/AvatarEquipChange"
import AvatarTeamUpdate from "#/packets/AvatarTeamUpdate"
import SceneTeamUpdate from "#/packets/SceneTeamUpdate"
import { SetUpAvatarTeamReq } from "#/packets/SetUpAvatarTeam"
import Avatar from "$/entity/avatar"
import TeamManager from "$/manager/teamManager"
import { RetcodeEnum } from "@/types/proto/enum"

export default class Team {
  teamManager: TeamManager

  avatarList: Avatar[]
  initialized: boolean

  constructor(list: TeamManager) {
    this.teamManager = list

    this.avatarList = []
    this.initialized = false
  }

  private async notify(isCurTeam: boolean, teamId?: number, seqId?: number) {
    const { teamManager, avatarList } = this
    const { player } = teamManager
    const { context, currentScene } = player

    const broadcastContextList = currentScene?.broadcastContextList || [context]
    for (const broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

    for (const avatar of avatarList) await AvatarEquipChange.broadcastNotify(broadcastContextList, avatar)

    if (!player.isInMp()) await AvatarTeamUpdate.sendNotify(context, teamId)
    if (isCurTeam) await SceneTeamUpdate.broadcastNotify(broadcastContextList)
  }

  get id(): number {
    return this.teamManager.teamList.indexOf(this)
  }

  getAvatarLimit() {
    const { player } = this.teamManager
    const playerCount = player.currentScene?.playerList?.length || 1
    return Math.floor(4 / playerCount) + (player.isHost() ? 4 % playerCount : 0)
  }

  getAvatarList(bypassLimit = false): Avatar[] {
    return this.avatarList.slice(0, bypassLimit ? this.avatarList.length : this.getAvatarLimit())
  }

  getAliveAvatarList(bypassLimit = false): Avatar[] {
    return this.getAvatarList(bypassLimit).filter((avatar) => avatar.isAlive())
  }

  getAvatar(guid: bigint) {
    const { guidManager } = this.teamManager.player

    if (!guidManager.isValidGuid(guid)) return null
    guid = guidManager.getGuid(guid)

    return this.getAvatarList().find((avatar) => avatar.guid === guid)
  }

  getAliveAvatar() {
    return this.getAvatarList().find((avatar) => avatar.isAlive())
  }

  async setUpAvatarTeam(
    data: SetUpAvatarTeamReq,
    noNotify = false,
    seqId?: number,
    revive = false
  ): Promise<RetcodeEnum> {
    const { teamManager, avatarList } = this
    const { player, currentTeam } = teamManager
    const { currentScene, currentAvatar: oldAvatar } = player
    const { teamId, avatarTeamGuidList, curAvatarGuid } = data

    this.initialized = true

    const avatarTeamList = avatarTeamGuidList
      .map((guid) => player.getAvatar(BigInt(guid)))
      .filter((avatar) => avatar != null)
    if (avatarTeamList.length === 0) avatarTeamList.push(player.avatarList[0])
    if (!revive && !avatarTeamList.find((avatar) => avatar.isAlive())) return RetcodeEnum.RET_AVATAR_NOT_ALIVE

    avatarList.splice(0)
    avatarList.push(...avatarTeamList)

    const isCurTeam = teamId == null || Number(!player.isInMp()) * currentTeam === teamId

    if (!noNotify) await this.notify(isCurTeam, teamId, seqId)
    if (!isCurTeam) return RetcodeEnum.RET_SUCC

    if (!avatarTeamGuidList.includes(curAvatarGuid)) {
      player.currentAvatar = this.getAliveAvatar() || avatarList[0]
    } else if (oldAvatar?.guid !== BigInt(curAvatarGuid)) {
      player.currentAvatar = this.getAvatar(BigInt(curAvatarGuid)) || this.getAliveAvatar() || avatarList[0]
    }

    const { currentAvatar } = player
    if (oldAvatar && currentAvatar !== oldAvatar) {
      currentAvatar.motion.copy(oldAvatar.motion)
      currentScene?.entityManager?.replace(oldAvatar, currentAvatar, seqId)
    }

    return RetcodeEnum.RET_SUCC
  }

  async reviveAllAvatar(): Promise<void> {
    const avatarList = this.getAvatarList()

    for (const avatar of avatarList) {
      if (!avatar.isAlive()) await avatar.revive()
    }
  }

  clear() {
    this.initialized = false
    this.avatarList.splice(0)
  }

  exportGuidList(keepCurAvatar = false, bypassLimit = false) {
    const { currentAvatar } = this.teamManager.player
    const limit = this.getAvatarLimit()
    let avatarList = this.getAvatarList(true)

    if (keepCurAvatar && !avatarList.slice(0, limit).includes(currentAvatar)) {
      avatarList = avatarList
        .map((avatar, i) => [avatar, avatar === currentAvatar ? -1 : i])
        .sort((a, b) => Math.sign(<number>a[1] - <number>b[1]))
        .map((arr) => <Avatar>arr[0])
    }

    return avatarList.map((avatar) => avatar.guid.toString()).slice(0, bypassLimit ? undefined : limit)
  }
}
