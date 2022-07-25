import { BuildingInfo } from '.'
import { FoundationStatusEnum } from './enum'

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