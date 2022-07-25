import { EquipInfo, FurnitureInfo, MaterialInfo } from '.'

export interface ItemInfo {
  material?: MaterialInfo
  equip?: EquipInfo
  furniture?: FurnitureInfo

  itemId: number
  guid: string
}