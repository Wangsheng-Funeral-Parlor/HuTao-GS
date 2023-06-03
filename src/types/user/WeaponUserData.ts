import EntityUserData from "./EntityUserData"
import EquipUserData from "./EquipUserData"

export interface WeaponAffixUserData {
  id: number
  level: number
}

export default interface WeaponUserData extends EquipUserData {
  affixDataList: WeaponAffixUserData[]
  entityData: EntityUserData
}
