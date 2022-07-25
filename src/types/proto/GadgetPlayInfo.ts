import { GadgetCrucibleInfo } from '.'

export interface GadgetPlayInfo {
  crucibleInfo: GadgetCrucibleInfo

  playType: number
  duration: number
  progressStageList: number[]
  startCd: number
  startTime: number
  progress: number
}