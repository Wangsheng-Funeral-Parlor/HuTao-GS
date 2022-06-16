export interface TowerCurLevelRecord {
  curFloorId?: number
  curLevelIndex?: number
  towerTeamList?: TowerTeam[]
  buffIdList?: number[]
  isEmpty?: boolean
}

export interface TowerFloorRecord {
  floorId: number
  passedLevelMap: { [level: number]: number }
  floorStarRewardProgress: number
  passedLevelRecordList: TowerLevelRecord[]
}

export interface TowerLevelRecord {
  levelId: number
  satisfiedCondList: number[]
}

export interface TowerMonthlyBrief {
  towerScheduleId: number
  bestFloorIndex: number
  bestLevelIndex: number
  totalStarCount: number
}

export interface TowerTeam {
  towerTeamId: number
  avatarGuidList: number[]
}