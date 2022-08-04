import EquipUserData from "./EquipUserData"
import MaterialUserData from "./MaterialUserData"

export enum ItemDataTypeEnum {
  NONE = 0,
  MATERIAL = 1,
  EQUIP = 2,
  FURNITURE = 3
}

export interface ItemUserData {
  itemId: number
  gadgetId: number
  type: ItemDataTypeEnum
  data: EquipUserData | MaterialUserData
}

export default interface InventoryUserData {
  itemDataList: ItemUserData[]
}