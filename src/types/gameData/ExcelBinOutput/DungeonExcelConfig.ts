export interface DungeonExcelConfig {
  Id: number
  NameTextMapHash: number
  DisplayNameTextMapHash: number
  DescTextMapHash: number
  Type: string
  SceneId: number
  InvolveType: string
  SettleCountdownTime: number
  FailSettleCountdownTime: number
  QuitSettleCountdownTime: number
  SettleShows: string[]
  RecommendElementTypes: string[]
  LevelConfigMap: { [id: string]: number }
  EnterCostItems: number[]
  CityID: number
  EntryPicPath: string

  ShowLevel?: number
  LimitLevel?: number
  LevelRevise?: number
  PassCond?: number
  ReviveMaxCount?: number
  DayEnterCount?: number
  PassRewardPreviewID?: number
  ForbiddenRestart?: boolean
  SettleUIType?: string
  StateType?: string
  AvatarLimitType?: number
  IsDynamicLevel?: boolean
  SubType?: string
  SerialId?: number
  PassJumpDungeon?: number
  DontShowPushTips?: boolean
  PlayType?: string
  EventInterval?: number
  FirstPassRewardPreviewID?: number
  ReviveIntervalTime?: number
  StatueCostID?: number
  StatueCostCount?: number
  StatueDrop?: number
}

type DungeonExcelConfigList = DungeonExcelConfig[]

export default DungeonExcelConfigList
