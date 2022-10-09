import AbilityChange from '#/packets/AbilityChange'
import AvatarSkillDepotChange from '#/packets/AvatarSkillDepotChange'
import Avatar from '$/entity/avatar'
import Skill from '$/entity/avatar/skill/skill'
import SkillDepot from '$/entity/avatar/skill/skillDepot'
import AvatarData from '$/gameData/data/AvatarData'
import { ElemTypeEnum } from '@/types/enum'
import SkillManagerUserData from '@/types/user/SkillManagerUserData'

export default class SkillManager {
  avatar: Avatar

  candSkillId: number
  depotList: SkillDepot[]

  constructor(avatar: Avatar) {
    this.avatar = avatar

    this.candSkillId = 0
    this.depotList = []
  }

  private async loadSkillDepotData() {
    const { avatar, depotList } = this
    const { avatarId } = avatar

    depotList.splice(0)

    const avatarData = await AvatarData.getAvatar(avatarId)
    if (!avatarData) return

    const skillIds = [avatarData.SkillDepotId, ...(avatarData.CandSkillDepotIds || [])]
      .filter((depotId, i, arr) => depotId != null && arr.indexOf(depotId) === i)

    for (const skillId of skillIds) depotList.push(new SkillDepot(this, skillId))
  }

  async init(userData: SkillManagerUserData) {
    await this.loadSkillDepotData()

    const {
      candSkillId,
      depotDataList
    } = userData || {}
    const { depotList } = this

    for (const depot of depotList) {
      const depotData = depotDataList?.find(data => data?.id === depot.id)
      if (depotData) await depot.init(depotData)
      else await depot.initNew()
    }

    await this.setCandSkillId(parseInt(candSkillId?.toString()) || 0)
  }

  async initNew() {
    await this.loadSkillDepotData()

    const { depotList } = this
    for (const depot of depotList) await depot.initNew()

    await this.setCandSkillId(0)
  }

  get currentDepot(): SkillDepot | null {
    const { candSkillId, depotList } = this
    return depotList[candSkillId] || depotList[0] || null
  }

  get energySkill(): Skill | null {
    return this.currentDepot?.energySkill || null
  }

  get costElemVal(): number {
    return this.energySkill?.costElemVal || 0
  }

  get costElemType(): ElemTypeEnum {
    return this.energySkill?.costElemType || ElemTypeEnum.NONE
  }

  getDepotById(id: number): SkillDepot | null {
    return this.depotList.find(depot => depot.id === id) || null
  }

  async setCandSkillId(id: number): Promise<boolean> {
    const { avatar, depotList } = this
    const { player, fightProps, talentManager } = avatar

    id = parseInt(id?.toString())
    if (isNaN(id) || depotList[id] == null) return false

    talentManager.removeEmbryos()
    talentManager.removeAllTalents()
    this.currentDepot?.removeEmbryos()

    this.candSkillId = id

    this.currentDepot?.addEmbryos()
    await talentManager.addFromSkillDepot()
    talentManager.addEmbryos()

    // TODO: Trigger quest cond

    const { currentScene } = player
    if (currentScene != null) {
      const { broadcastContextList } = currentScene
      await AvatarSkillDepotChange.broadcastNotify(broadcastContextList, avatar)
      await AbilityChange.broadcastNotify(broadcastContextList, avatar)
      await fightProps.update(true)
    }

    return true
  }

  export() {
    return this.currentDepot?.export() || null
  }

  exportUserData(): SkillManagerUserData {
    const { candSkillId, depotList } = this

    return {
      candSkillId,
      depotDataList: depotList.map(depot => depot.exportUserData())
    }
  }
}