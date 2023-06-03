import { WeeklyBossResinDiscountInfo } from "."

export interface DungeonEntryInfo {
  dungeonId: number
  isPassed?: boolean
  leftTimes?: number
  startTime?: number
  endTime?: number
  maxBossChestNum?: number
  bossChestNum?: number
  nextRefreshTime?: number
  weeklyBossResinDiscountInfo?: WeeklyBossResinDiscountInfo
}
