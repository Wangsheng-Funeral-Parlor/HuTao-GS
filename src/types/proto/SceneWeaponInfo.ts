import { AbilitySyncStateInfo } from '.'

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