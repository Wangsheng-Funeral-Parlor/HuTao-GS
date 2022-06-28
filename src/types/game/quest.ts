import { CoopChapterStateEnum, CoopPointStateEnum, CoopRewardStateEnum, PersonalLineLockReasonEnum } from '../enum/quest'

export interface CoopCg {
  id: number
  isUnlock?: boolean
}

export interface CoopChapter {
  id: number
  state: CoopChapterStateEnum
  lockReasonList: number[]
  coopPointList: CoopPoint[]
  coopRewardList: CoopReward[]
  coopCgList: CoopCg[]
  totalEndCount: number
  finishedEndCount: number
  seenEndingMap: { [id: number]: number }
  finishDialogList: number[]
}

export interface CoopPoint {
  id: number
  state: CoopPointStateEnum
  selfConfidence: number
}

export interface CoopReward {
  id: number
  state: CoopRewardStateEnum
}

export interface LockedPersonallineData {
  chapterId: number
  level: number

  personalLineId: number
  lockReason: PersonalLineLockReasonEnum
}

export interface ChildQuest {
  questId: number
  state: number
  questConfigId?: number
}

export interface ParentQuest {
  parentQuestId: number
  childQuestList?: ChildQuest[]
  isFinished?: boolean
  isRandom?: boolean
  randomInfo?: ParentQuestRandomInfo
  questVar: number[]
  parentQuestState?: number
  questVarSeq?: number
  timeVarMap?: { [k: number]: number }
  GJJJKEIPAPC?: number
}

export interface ParentQuestRandomInfo {
  entranceId: number
  templateId: number
  factorList: number[]
}

export interface Quest {
  questId: number
  state: number
  startTime: number
  isRandom?: boolean
  parentQuestId: number
  questConfigId?: number
  startGameTime: number
  acceptTime: number
  lackedNpcList?: number[]
  finishProgressList?: number[]
  failProgressList?: number[]
  lackedNpcMap?: { [k: number]: number }
  lackedPlaceList?: number[]
  lackedPlaceMap?: { [k: number]: number }
}