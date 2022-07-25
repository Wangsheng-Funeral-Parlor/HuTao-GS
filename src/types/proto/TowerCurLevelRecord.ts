import { TowerTeam } from '.'

export interface TowerCurLevelRecord {
  curFloorId?: number
  curLevelIndex?: number
  towerTeamList?: TowerTeam[]
  buffIdList?: number[]
  isEmpty?: boolean
}