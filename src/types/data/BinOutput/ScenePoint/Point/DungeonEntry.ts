import Vector from '../../Common/Vector'
import { Point } from '.'

export default interface DungeonEntry extends Point {
  GroupLimit?: boolean
  CutsceneList?: number[]
  MapVisibility?: string
  DungeonIds?: number[]
  DungeonQuestConditionList: {}
  Size?: Vector
  TitleTextID: string
  ShowLevel?: number
  DungeonRandomList?: number[]
  DungeonEntryType?: string
  ForbidSimpleUnlock?: boolean
  FireFieldEvent?: boolean
  RemoveEntityIfLocked?: boolean
  DungeonRosterList?: number[]
}