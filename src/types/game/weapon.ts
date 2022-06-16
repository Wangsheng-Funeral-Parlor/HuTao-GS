import { AbilitySyncStateInfo } from './ability'

export interface WeaponInterface {
  level: number
  exp: number
  promoteLevel: number
  affixMap: { [id: number]: number }
}

export interface SceneWeaponInfo {
  entityId: number
  gadgetId: number
  itemId: number
  guid: string
  level: number
  promoteLevel: number
  abilityInfo: AbilitySyncStateInfo
  affixMap: { [id: number]: number }
}