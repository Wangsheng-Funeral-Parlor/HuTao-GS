export interface DungeonEntryExcelConfig {
  Id: number
  SceneId: number
  DungeonEntryId: number
  Type: string
  DescTextMapHash: number
  CooldownTipsDungeonId: number[]
  SatisfiedCond: {
    Type?: string
    Param1?: number
  }[]
  PicPath: string
  DescriptionCycleRewardList: number[][]

  IsShowInAdvHandbook?: boolean
  CondComb?: string
  SystemOpenUiId?: number
  RewardDataId?: number
  IsDailyRefresh?: boolean
  IsDefaultOpen?: boolean
}

type DungeonEntryExcelConfigList = DungeonEntryExcelConfig[]

export default DungeonEntryExcelConfigList
