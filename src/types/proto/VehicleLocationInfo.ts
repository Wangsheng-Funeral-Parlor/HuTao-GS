import { VectorInfo } from "."

export interface VehicleLocationInfo {
  entityId: number
  gadgetId: number
  ownerUid: number
  pos: VectorInfo
  rot: VectorInfo
  curHp: number
  maxHp: number
  uidList: number[]
}
