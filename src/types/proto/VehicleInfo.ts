import { VehicleMember } from "."

export interface VehicleInfo {
  memberList: VehicleMember[]
  ownerUid: number
  curStamina: number
}
