import { ReliquaryInfo, WeaponInfo } from '.'

export interface EquipInfo {
  reliquary?: ReliquaryInfo
  weapon?: WeaponInfo
  isLocked: boolean
}