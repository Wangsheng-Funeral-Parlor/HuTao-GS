import { WeeklyBossResinDiscountInfo } from '.'

export interface BossChestInfo {
  monsterConfigId: number
  resin: number
  remainUidList: number[]
  qualifyUidList: number[]
  uidDiscountMap: { [id: number]: WeeklyBossResinDiscountInfo }
}