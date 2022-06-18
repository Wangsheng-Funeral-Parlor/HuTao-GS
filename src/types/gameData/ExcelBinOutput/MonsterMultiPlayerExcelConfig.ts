export interface MonsterMultiPlayerExcelConfig {
  Id: number
  PropPer: {
    PropType: string
    PropValue: number[]
  }[]
  EndureNum: number[]
  ElementShield: number[]
}

type MonsterMultiPlayerExcelConfigList = MonsterMultiPlayerExcelConfig[]

export default MonsterMultiPlayerExcelConfigList