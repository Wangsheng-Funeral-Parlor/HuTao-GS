import EquipUserData from "./EquipUserData"
import MaterialUserData from "./MaterialUserData"

export enum ItemTypeEnum {
  NONE = 0,
  MATERIAL = 1,
  EQUIP = 2,
  FURNITURE = 3
}

export interface ItemUserData {
  guid: string
  itemId: number
  type: ItemTypeEnum
  data: EquipUserData | MaterialUserData
}

export default interface InventoryUserData {
  itemDataList: ItemUserData[]
}