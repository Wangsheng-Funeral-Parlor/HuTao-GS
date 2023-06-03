import { FoundationStatusEnum } from "./enum"

import { BuildingInfo } from "."

export interface FoundationInfo {
  status: FoundationStatusEnum
  uidList: number[]
  currentBuildingId: number
  beginBuildTimeMs: number
  demolitionRefund: number
  buildingList: BuildingInfo[]
  currentNum: number
  maxNum: number
  lockedByUid: number
}
