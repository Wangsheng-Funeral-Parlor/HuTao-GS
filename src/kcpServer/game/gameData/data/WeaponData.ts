import Loader from '$/gameData/loader'
import { EntityFightPropConfig } from '@/types/game/entity'
import WeaponDataGroup, { WeaponData } from '@/types/gameData/WeaponData'

class WeaponDataLoader extends Loader {
  declare data: WeaponDataGroup

  constructor() {
    super('WeaponData')
  }

  getWeapon(id: number): WeaponData {
    return this.getWeaponList().find(data => data.Id === id)
  }

  getWeaponList(): WeaponData[] {
    return this.data?.Weapon || []
  }

  getFightPropConfig(id: number): EntityFightPropConfig {
    const data = this.getWeapon(id)
    if (!data) {
      return {
        PropGrowCurves: []
      }
    }

    const { Prop } = data

    return {
      PropGrowCurves: Prop.map(c => ({
        PropType: c.PropType,
        Value: c.InitValue,
        Type: c.Type
      }))
    }
  }
}

let loader: WeaponDataLoader
export default (() => loader = loader || new WeaponDataLoader())()