export interface MonsterAffixExcelConfig {
  Id: number
  Affix: string
  Comment: string
  AbilityName: string[]
  IsLegal: string
  IconPath: string
  GeneralSkillIcon: string
  IsCommon?: boolean
  PreAdd?: boolean
}

type MonsterAffixExcelConfigList = MonsterAffixExcelConfig[]

export default MonsterAffixExcelConfigList
