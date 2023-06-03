export interface MonsterSpecialNameExcelConfig {
  SpecialNameID: number
  SpecialNameLabID: number
  SpecialNameTextMapHash: number
  IsInRandomList?: boolean
}

type MonsterSpecialNameExcelConfigList = MonsterSpecialNameExcelConfig[]

export default MonsterSpecialNameExcelConfigList
