import { VectorInterface } from "./motion"

export interface CurVehicleInfo {
  entityId: number
  pos: number
}

export interface VehicleInfo {
  memberList: VehicleMember[]
  ownerUid: number
  curStamina: number
}

export interface VehicleLocationInfo {
  entityId: number
  gadgetId: number
  ownerUid: number
  pos: VectorInterface
  rot: VectorInterface
  curHp: number
  maxHp: number
  uidList: number[]
}

export interface VehicleMember {
  uid: number
  avatarGuid: string
  pos: number
}