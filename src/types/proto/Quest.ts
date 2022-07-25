export interface Quest {
  questId?: number
  state?: number
  startTime?: number
  isRandom?: boolean
  parentQuestId?: number
  questConfigId?: number
  startGameTime?: number
  acceptTime?: number
  lackedNpcList?: number[]
  finishProgressList?: number[]
  failProgressList?: number[]
  lackedNpcMap?: { [k: number]: number }
  lackedPlaceList?: number[]
  lackedPlaceMap?: { [k: number]: number }
}