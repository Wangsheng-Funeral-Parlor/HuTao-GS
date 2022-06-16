export interface ReliquaryLevelExcelConfig {
  Level: number
  AddProps: {
    PropType: string
    Value: number
  }[]
  Rank?: number
  Exp?: number
}

type ReliquaryLevelExcelConfigList = ReliquaryLevelExcelConfig[]

export default ReliquaryLevelExcelConfigList