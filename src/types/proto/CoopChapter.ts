import { CoopChapterStateEnum } from "./enum"

import { CoopCg, CoopPoint, CoopReward } from "."

export interface CoopChapter {
  id?: number
  state?: CoopChapterStateEnum
  lockReasonList?: number[]
  coopPointList?: CoopPoint[]
  coopRewardList?: CoopReward[]
  coopCgList?: CoopCg[]
  totalEndCount?: number
  finishedEndCount?: number
  seenEndingMap?: { [id: number]: number }
  finishDialogList?: number[]
}
