import Loader from '$/gameData/loader'
import WeaponDataGroup, { WeaponData } from '@/types/data/WeaponData'

class WeaponDataLoader extends Loader {
  declare data: WeaponDataGroup

  constructor() {
    super('WeaponData')
  }

  get(id: number): WeaponData {
    return this.getList().find(data => data.Id === id)
  }

  getList(): WeaponData[] {
    return this.data?.Weapon || []
  }
}

let loader: WeaponDataLoader
export default (() => loader = loader || new WeaponDataLoader())()