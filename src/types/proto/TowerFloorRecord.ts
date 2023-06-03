import { TowerLevelRecord } from "."

export interface TowerFloorRecord {
  floorId: number
  passedLevelMap: { [level: number]: number }
  floorStarRewardProgress: number
  passedLevelRecordList: TowerLevelRecord[]
}
