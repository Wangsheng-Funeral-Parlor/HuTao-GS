import Loader from "$/gameData/loader"
import { EntityFightPropConfig } from "@/types/game"
import WeaponDataGroup, { WeaponData } from "@/types/gameData/WeaponData"

class WeaponDataLoader extends Loader {
  declare data: WeaponDataGroup

  constructor() {
    super("WeaponData", "message.cache.debug.weapon")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getWeapon(id: number): WeaponData {
    return this.getWeaponList().find((data) => data.Id === id)
  }

  getWeaponByGadgetId(gadgetId: number): WeaponData {
    return this.getWeaponList().find((data) => data.GadgetId === gadgetId)
  }

  getWeaponList(): WeaponData[] {
    return this.data?.Weapon || []
  }

  getFightPropConfig(id: number): EntityFightPropConfig {
    const data = this.getWeapon(id)
    if (!data) {
      return {
        PropGrowCurves: [],
      }
    }

    const { Prop } = data

    return {
      PropGrowCurves: Prop.map((c) => ({
        PropType: c.PropType,
        Value: c.InitValue,
        Type: c.Type,
      })),
    }
  }
}

let loader: WeaponDataLoader
export default (() => (loader = loader || new WeaponDataLoader()))()
