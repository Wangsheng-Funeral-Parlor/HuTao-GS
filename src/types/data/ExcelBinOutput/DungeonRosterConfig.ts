export interface DungeonRosterConfig {
  Id: number
  OpenTimeStr: string
  CycleTime: number
  CycleType: string
  RosterPool: {
    DungeonList: number[]
  }[]
}

type DungeonRosterConfigList = DungeonRosterConfig[]

export default DungeonRosterConfigList