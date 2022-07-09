import { EquipTypeEnum } from '../enum/equip'

export default interface EquipUserData {
  guid: string
  itemId: number
  type: EquipTypeEnum
  isLocked: boolean
}