import TalentData from "$/gameData/data/TalentData"
import TalentManager from "$/manager/talentManager"
import ConfigTalent from "$DT/BinOutput/Config/ConfigTalent"

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

  get unlocked(): boolean {
    const { manager, id } = this
    return manager?.unlockedIdList?.includes(id) || false
  }

  get abilityManager() {
    return this.manager.avatar.abilityManager
  }
  private loadTalentData() {
    const { id, abilityList } = this

    // clear abilities
    abilityList.splice(0)

    const talentData = TalentData.getAvatarTalent(id)
    if (!talentData) return

    const { Name, PrevTalent, Config, ParamList } = talentData

    this.name = Name || null
    this.prevTalentId = PrevTalent || null

    if (!Array.isArray(Config) || !this.unlocked) return
    for (const talentConfig of Config) this.ApplyTalentConfig(talentConfig, ParamList)
  }

  private ApplyTalentConfig(config: ConfigTalent, param: number[]) {
    const { abilityList } = this

    switch (
      config.$type // NOSONAR
    ) {
      case "AddAbility": {
        abilityList.push(config.AbilityName)
        break
      }
      case "ModifyAbility": {
        // const ability = this.abilityManager.getAbilityByName({
        //   hash: getStringHash(config.AbilityName),
        //   str: config.AbilityName,
        // })

        // ability.overrideMapContainer.setValue({
        //   floatValue: param[Number(config.ParamDelta.replace("%", "")) - 1],
        //   valueType: AbilityScalarTypeEnum.FLOAT,
        //   key: { hash: getStringHash(config.ParamSpecial), str: config.ParamSpecial },
        // })
        break
      }

      default:
        console.log(config.$type)
    }
  }

  init() {
    this.loadTalentData()
  }
}
