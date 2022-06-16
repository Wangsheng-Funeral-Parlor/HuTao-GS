import EntityUserData from './EntityUserData'
import EquipUserData from './EquipUserData'

export interface WeaponAffixUserData {
  id: number
  level: number
}

export default interface WeaponUserData extends EquipUserData {
  gadgetId: number
  affixDataList: WeaponAffixUserData[]
  entityData: EntityUserData
}