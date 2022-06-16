export enum EquipTypeEnum {
  NONE = 0,
  WEAPON = 1,
  RELIQUARY = 2
}

export default interface EquipUserData {
  guid: string
  itemId: number
  type: EquipTypeEnum
  isLocked: boolean
}