import InherentProudSkill from "./inherentProudSkill"
import Skill from "./skill"

import Embryo from "$/ability/embryo"
import AbilityData from "$/gameData/data/AbilityData"
import SkillData from "$/gameData/data/SkillData"
import SkillManager from "$/manager/skillManager"
import { PlayerPropEnum } from "@/types/enum"
import SkillDepotUserData from "@/types/user/SkillDepotUserData"

export default class SkillDepot {
  manager: SkillManager

  id: number

  inherentProudSkills: InherentProudSkill[]
  skills: Skill[]
  energySkill?: Skill

  extraAbilities: string[]
  abilityEmbryos: Embryo[]

  constructor(manager: SkillManager, id: number) {
    this.manager = manager

    this.id = id

    this.inherentProudSkills = []
    this.skills = []

    this.extraAbilities = []
    this.abilityEmbryos = []
  }

  private async loadSkillsData() {
    const { id, inherentProudSkills, skills, extraAbilities } = this

    inherentProudSkills.splice(0)
    skills.splice(0)
    extraAbilities.splice(0)

    const depotData = await SkillData.getSkillDepot(id)
    if (!depotData) return

    // inherentProudSkills
    for (const proudSkillOpen of depotData.InherentProudSkillOpens) {
      const { ProudSkillGroupId, NeedAvatarPromoteLevel } = proudSkillOpen || {}
      if (ProudSkillGroupId == null) continue

      const proudSkillData = await SkillData.getProudSkillByGroup(ProudSkillGroupId)
      if (proudSkillData == null) continue

      inherentProudSkills.push(new InherentProudSkill(this, proudSkillData.Id, NeedAvatarPromoteLevel))
    }

    // skills
    skills.push(...depotData.Skills.filter((skillId) => skillId !== 0).map((skillId) => new Skill(this, skillId)))

    // sub skills
    skills.push(...depotData.SubSkills.filter((skillId) => skillId !== 0).map((skillId) => new Skill(this, skillId)))

    // energy skill
    if (depotData.EnergySkill != null) this.energySkill = new Skill(this, depotData.EnergySkill)

    extraAbilities.push(
      ...(depotData.ExtraAbilities || []).filter((ability) => typeof ability === "string" && ability.length > 0)
    )

    const abilityGroupData = await AbilityData.getAbilityGroup(depotData.SkillDepotAbilityGroup)
    if (!abilityGroupData) return

    extraAbilities.push(
      ...(abilityGroupData.TargetAbilities || [])
        .filter((ability) => ability?.AbilityName)
        .map((ability) => ability.AbilityName)
    )
  }

  private addSkillsEmbryos() {
    const { manager, skills, energySkill } = this
    const { avatar } = manager
    const { abilityManager } = avatar
    const skillList = [energySkill, ...skills].filter((skill) => skill != null)

    for (const skill of skillList) {
      const { abilityName, abilityEmbryo } = skill
      if (abilityEmbryo != null) abilityEmbryo.manager.removeEmbryo(abilityEmbryo)
      skill.abilityEmbryo = abilityName ? abilityManager.addEmbryo(abilityName) : null
    }
  }

  private removeSkillsEmbryos() {
    const { skills, energySkill } = this
    const skillList = [energySkill, ...skills].filter((skill) => skill != null)

    for (const skill of skillList) {
      const { abilityEmbryo } = skill
      if (abilityEmbryo == null) continue

      abilityEmbryo.manager.removeEmbryo(abilityEmbryo)
    }
  }

  async init(userData: SkillDepotUserData) {
    await this.loadSkillsData()

    const { skills, energySkill } = this
    const { skillDataList, energySkillData } = userData || {}

    for (const skill of skills) {
      const skillData = skillDataList?.find((data) => data.id === skill.id)
      if (!skillData) continue

      await skill.init(skillData)
    }

    if (!energySkill) return

    if (energySkillData) await energySkill.init(energySkillData)
    else await energySkill.initNew()
  }

  async initNew() {
    await this.loadSkillsData()

    const { skills, energySkill } = this

    for (const skill of skills) await skill.initNew()

    await energySkill?.initNew()
  }

  addEmbryos() {
    const { manager, extraAbilities, abilityEmbryos } = this
    const { avatar } = manager
    const { abilityManager } = avatar

    this.addSkillsEmbryos()

    for (const ability of extraAbilities) {
      const embryo = abilityManager.addEmbryo(ability)
      if (!embryo) continue

      abilityEmbryos.push(embryo)
    }
  }

  removeEmbryos() {
    const { abilityEmbryos } = this

    this.removeSkillsEmbryos()

    while (abilityEmbryos.length > 0) {
      const embryo = abilityEmbryos.shift()
      embryo.manager.removeEmbryo(embryo)
    }
  }

  getSkill(id: number): Skill {
    if (this.energySkill?.id === id) return this.energySkill
    return this.skills.find((skill) => skill.id === id)
  }

  exportSkillLevelMap() {
    const { skills, energySkill } = this
    return Object.fromEntries(
      skills
        .concat(energySkill)
        .filter((skill) => skill != null)
        .map((skill) => [skill.id, skill.level])
    )
  }

  exportInherentProudSkillList() {
    const { manager, inherentProudSkills } = this
    const { avatar } = manager
    const { props } = avatar
    const promoteLevel = props.get(PlayerPropEnum.PROP_BREAK_LEVEL)

    return inherentProudSkills
      .filter((proudSkill) => proudSkill.promoteLevel == null || promoteLevel >= proudSkill.promoteLevel)
      .map((s) => s.id)
  }

  exportProudSkillExtraLevelMap() {
    const { skills } = this
    return Object.fromEntries(
      skills
        .filter((skill) => skill.proudSkill != null)
        .map((skill) => [skill.proudSkill.groupId, skill.proudSkill.level])
    )
  }

  export() {
    const { id } = this
    return {
      skillDepotId: id,
      inherentProudSkillList: this.exportInherentProudSkillList(),
      skillLevelMap: this.exportSkillLevelMap(),
      proudSkillExtraLevelMap: this.exportProudSkillExtraLevelMap(),
    }
  }

  exportUserData(): SkillDepotUserData {
    const { id, skills, energySkill } = this

    return {
      id,
      skillDataList: skills.map((skill) => skill.exportUserData()),
      energySkillData: energySkill?.exportUserData() || false,
    }
  }
}
