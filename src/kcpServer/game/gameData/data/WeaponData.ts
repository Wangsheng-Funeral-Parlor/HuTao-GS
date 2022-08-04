import Loader from '$/gameData/loader'
import { EntityFightPropConfig } from '@/types/game'
import WeaponDataGroup, { WeaponData } from '@/types/gameData/WeaponData'

class WeaponDataLoader extends Loader {
  declare data: WeaponDataGroup

  constructor() {
    super('WeaponData')
  }

  async getData(): Promise<WeaponDataGroup> {
    return super.getData()
  }

  async getWeapon(id: number): Promise<WeaponData> {
    return (await this.getWeaponList()).find(data => data.Id === id)
  }

  async getWeaponByGadgetId(gadgetId: number): Promise<WeaponData> {
    return (await this.getWeaponList()).find(data => data.GadgetId === gadgetId)
  }

  async getWeaponList(): Promise<WeaponData[]> {
    return (await this.getData())?.Weapon || []
  }

  async getFightPropConfig(id: number): Promise<EntityFightPropConfig> {
    const data = await this.getWeapon(id)
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