import AbilityChange from '#/packets/AbilityChange'
import AvatarUnlockTalent from '#/packets/AvatarUnlockTalent'
import Embryo from '$/ability/embryo'
import Avatar from '$/entity/avatar'
import Talent from '$/entity/avatar/talent'
import SkillData from '$/gameData/data/SkillData'
import TalentUserData from '@/types/user/TalentUserData'

export default class TalentManager {
  avatar: Avatar

  talents: Talent[]
  unlockedIdList: number[]

  abilityEmbryos: Embryo[]

  constructor(avatar: Avatar) {
    this.avatar = avatar

    this.talents = []
    this.unlockedIdList = []

    this.abilityEmbryos = []
  }

  get unlockedTalents(): Talent[] {
    const { talents, unlockedIdList } = this
    return talents.filter(t => unlockedIdList.includes(t.id))
  }

  async init(userData: TalentUserData) {
    const { unlockedIdList } = userData || {}

    this.unlockedIdList.splice(0)
    if (Array.isArray(unlockedIdList)) this.unlockedIdList.push(...unlockedIdList)
  }

  async addFromSkillDepot() {
    const { avatar, talents } = this
    const { skillManager } = avatar
    const { currentDepot } = skillManager

    const depotData = await SkillData.getSkillDepot(currentDepot?.id)
    if (!depotData) return

    const { Talents } = depotData
    if (!Array.isArray(Talents)) return

    for (const talentId of Talents) {
      const talent = new Talent(this, talentId)
      await talent.init()
      talents.push(talent)
    }
  }

  removeAllTalents() {
    const { talents } = this
    talents.splice(0)
  }

  getNextTalent(prev?: Talent): Talent | null {
    const { talents } = this
    return talents.find(t => t.prevTalentId === (prev?.id || null)) || null
  }

  async unlockTalent(): Promise<Talent | null> {
    const { avatar, unlockedIdList } = this
    const { player } = avatar

    let talent: Talent = null
    for (let i = 0; i < 32; i++) {
      talent = this.getNextTalent(talent)
      if (talent == null) return null
      if (talent.unlocked) continue

      unlockedIdList.push(talent.id)

      this.removeEmbryos()
      this.addEmbryos()

      const { currentScene } = player
      if (currentScene != null) {
        const { broadcastContextList } = currentScene
        await AvatarUnlockTalent.broadcastNotify(broadcastContextList, talent)
        await AbilityChange.broadcastNotify(broadcastContextList, avatar)
      }

      return talent
    }

    // circular dependency? or there's way too many talents?
    return null
  }

  async lockTalent(): Promise<Talent | null> {
    const { unlockedIdList } = this

    let prevTalent: Talent = null
    let talent: Talent = null
    for (let i = 0; i < 32; i++) {
      prevTalent = talent
      talent = this.getNextTalent(talent)
      if (talent == null && !prevTalent?.unlocked) return null // can't find any talent or all talents are locked
      if (talent?.unlocked) continue

      unlockedIdList.splice(unlockedIdList.indexOf(prevTalent.id), 1)
      return prevTalent
    }

    // circular dependency? or there's way too many talents?
    return null
  }

  addEmbryos() {
    const { avatar, unlockedTalents, abilityEmbryos } = this
    const { abilityManager } = avatar

    for (const talent of unlockedTalents) {
      const { abilityList } = talent
      for (const ability of abilityList) {
        const embryo = abilityManager.addEmbryo(ability)
        if (!embryo) continue

        abilityEmbryos.push(embryo)
      }
    }
  }

  removeEmbryos() {
    const { abilityEmbryos } = this

    while (abilityEmbryos.length > 0) {
      const embryo = abilityEmbryos.shift()
      embryo.manager.removeEmbryo(embryo)
    }
  }

  exportIdList(): number[] {
    return this.unlockedTalents.map(t => t.id)
  }

  exportUserData(): TalentUserData {
    const { unlockedIdList } = this

    return {
      unlockedIdList
    }
  }
}