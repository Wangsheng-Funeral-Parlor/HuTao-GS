export interface AvatarSkillDepotExcelConfig {
  Id: number
  Skills: number[]
  SubSkills: number[]
  ExtraAbilities: string[]
  Talents: number[]
  TalentStarName: string
  InherentProudSkillOpens: {
    ProudSkillGroupId?: number
    NeedAvatarPromoteLevel?: number
  }[]
  SkillDepotAbilityGroup: string

  EnergySkill?: number
  LeaderTalent?: number
  AttackModeSkill?: number
}

type AvatarSkillDepotExcelConfigList = AvatarSkillDepotExcelConfig[]

export default AvatarSkillDepotExcelConfigList
