import { ChildQuest, ParentQuestRandomInfo } from '.'

export interface ParentQuest {
  parentQuestId?: number
  childQuestList?: ChildQuest[]
  isFinished?: boolean
  isRandom?: boolean
  randomInfo?: ParentQuestRandomInfo
  questVar?: number[]
  parentQuestState?: number
  questVarSeq?: number
  timeVarMap?: { [k: number]: number }
  GJJJKEIPAPC?: number
}