import TalentData from '$/gameData/data/TalentData'
import TalentManager from '$/manager/talentManager'
import ConfigTalent from '$DT/BinOutput/Config/ConfigTalent'

export default class Talent {
  manager: TalentManager

  id: number
  name: string
  prevTalentId: number

  abilityList: string[]

  constructor(manager: TalentManager, talentId: number) {
    this.manager = manager

    this.id = talentId
    this.name = null
    this.prevTalentId = null

    this.abilityList = []
  }

  private async loadTalentData() {
    const { id, abilityList } = this

    // clear abilities
    abilityList.splice(0)

    const talentData = await TalentData.getAvatarTalent(id)
    if (!talentData) return

    const { Name, PrevTalent, Config } = talentData

    this.name = Name || null
    this.prevTalentId = PrevTalent || null

    if (!Array.isArray(Config)) return
    for (const talentConfig of Config) this.loadTalentConfig(talentConfig)
  }

  private loadTalentConfig(config: ConfigTalent) {
    const { abilityList } = this

    switch (config.$type) { // NOSONAR
      case 'AddAbility':
        abilityList.push(config.AbilityName)
        break
    }
  }

  get unlocked(): boolean {
    const { manager, id } = this
    return manager?.unlockedIdList?.includes(id) || false
  }

  async init() {
    await this.loadTalentData()
  }
}