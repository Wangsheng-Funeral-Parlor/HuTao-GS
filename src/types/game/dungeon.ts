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

export interface WeeklyBossResinDiscountInfo {
  discountNum: number
  discountNumLimit: number
  resinCost: number
  originalResinCost: number
}