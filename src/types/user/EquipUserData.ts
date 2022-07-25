import { EquipTypeEnum } from '../enum'

export default interface EquipUserData {
  guid: string
  itemId: number
  type: EquipTypeEnum
  isLocked: boolean
}