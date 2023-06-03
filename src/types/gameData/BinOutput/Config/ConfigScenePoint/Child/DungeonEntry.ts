import DungeonQuestCondition from "../../DungeonQuestCondition"

import SceneTransPoint from "./SceneTransPoint"

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface DungeonEntry extends Omit<SceneTransPoint, "$type"> {
  $type: "DungeonEntry"
  DungeonIds: number[]
  DungeonQuestConditionList: DungeonQuestCondition
  Size: DynamicVector
  WorktopGroupId: number
  TitleTextID: string
  ShowLevel: number
  DungeonRandomList: number[]
  DungeonEntryType: string
  MapVisibility: string
  ForbidSimpleUnlock: boolean
  FireFieldEvent: boolean
  DungeonRosterList: number[]
  RemoveEntityIfLocked: boolean
}
