export interface DungeonPassExcelConfig {
  Id: number
  Conds: {
    CondType?: string
    Param: number[]
  }[]

  LogicType?: string
}

type DungeonPassExcelConfigList = DungeonPassExcelConfig[]

export default DungeonPassExcelConfigList