import { EquipTypeEnum } from "../enum"

export default interface EquipUserData {
  guid: string
  itemId: number
  gadgetId: number
  type: EquipTypeEnum
  isLocked: boolean
}
