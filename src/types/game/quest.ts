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