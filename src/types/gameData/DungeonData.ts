export interface DungeonData {
  Id: number
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
  ForbiddenRestart: boolean
  IsDynamicLevel: boolean
  DontShowPushTips: boolean

  ShowLevel?: number
  LimitLevel?: number
  LevelRevise?: number
  PassCond?: number
  ReviveMaxCount?: number
  DayEnterCount?: number
  PassRewardPreviewID?: number
  SettleUIType?: string
  StateType?: string
  AvatarLimitType?: number
  SubType?: string
  SerialId?: number
  PassJumpDungeon?: number
  PlayType?: string
  EventInterval?: number
  FirstPassRewardPreviewID?: number
  ReviveIntervalTime?: number
  StatueCostID?: number
  StatueCostCount?: number
  StatueDrop?: number

  Challenge?: DungeonChallengeData

  ElementChallenge?: {
    TrialAvatarId: number[]
    TutorialId: number
  }

  LevelEntity?: {
    ClientId: number
    LevelConfigName: string
    Show: boolean
  }

  Pass?: {
    Conds: {
      CondType?: string
      Param: number[]
    }[]

    LogicType?: string
  }

  Serial?: {
    MaxTakeNum: number

    TakeCost?: number
  }
}

export interface DungeonChallengeData {
  Id: number
  ChallengeType: string
  NoSuccessHint: boolean
  NoFailHint: boolean
  IsBlockTopTimer: boolean
  IsSuccessWhenNotSettled: boolean

  InterruptButtonType?: string
  SubChallengeFadeOutRule?: string
  SubChallengeFadeOutDelayTime?: number
  SubChallengeBannerRule?: string
  RecordType?: string
  ActivitySkillID?: number
}
export interface DungeonEntryData {
  Id: number
  SceneId: number
  DungeonEntryId: number
  Type: string
  CooldownTipsDungeonId: number[]
  SatisfiedCond: {
    Type?: string
    Param1?: number
  }[]
  DescriptionCycleRewardList: number[][]

  IsShowInAdvHandbook?: boolean
  CondComb?: string
  SystemOpenUiId?: number
  RewardDataId?: number
  IsDailyRefresh?: boolean
  IsDefaultOpen?: boolean
}

export interface DungeonMapAreaData {
  DungeonID: number
  AreaID: number
}

export interface DungeonRosterData {
  Id: number
  OpenTimeStr: string
  CycleTime: number
  CycleType: string
  RosterPool: {
    DungeonList: number[]
  }[]
}

export default interface DungeonDataGroup {
  Dungeon: DungeonData[]
  Entry: DungeonEntryData[]
  MapArea: DungeonMapAreaData[]
  Roster: DungeonRosterData[]
  Challenge: DungeonChallengeData[]
}
