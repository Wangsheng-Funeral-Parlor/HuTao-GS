import { ChallengeBrief } from "./ChallengeBrief"
import { CustomDungeonFinishType } from "./enum/CustomDungeonFinishType"

export interface CustomDungeonResultInfo {
  finishType: CustomDungeonFinishType
  isStored: boolean
  dungeonGuid: bigint
  isLiked: boolean
  isArriveFinish: boolean
  gotCoinNum: number
  childChallengeList: ChallengeBrief[]
  timeCost: number
}
