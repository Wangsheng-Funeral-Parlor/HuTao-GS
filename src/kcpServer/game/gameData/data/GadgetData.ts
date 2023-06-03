import Loader from "$/gameData/loader"
import { EntityFightPropConfig } from "@/types/game"
import GadgetDataGroup, { GadgetData, GadgetPropData } from "@/types/gameData/GadgetData"

class GadgetDataLoader extends Loader {
  declare data: GadgetDataGroup

  constructor() {
    super("GadgetData", "message.cache.debug.gadget")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getGadget(id: number): GadgetData {
    return this.getGadgetList().find((data) => data.Id === id)
  }

  getGadgetList(): GadgetData[] {
    return this.data.Gadget || []
  }

  getProp(id: number): GadgetPropData {
    return this.getPropList().find((data) => data.Id === id)
  }

  getPropList(): GadgetPropData[] {
    return this.data.Prop || []
  }

  getFightPropConfig(id: number): EntityFightPropConfig {
    const propData = this.getProp(id)
    if (!propData) {
      const gadgetData = this.getGadget(id)
      const { HP, Attack, Defense } = gadgetData?.Config?.Combat?.Property || {}

      return {
        HpBase: HP || 0,
        AttackBase: Attack || 0,
        DefenseBase: Defense || 0,
        PropGrowCurves: [],
      }
    }

    const { Hp, Attack, Defense, HpCurve, AttackCurve, DefenseCurve } = propData

    return {
      HpBase: Hp,
      AttackBase: Attack,
      DefenseBase: Defense,
      PropGrowCurves: [
        {
          PropType: "FIGHT_PROP_BASE_HP",
          Type: HpCurve,
        },
        {
          PropType: "FIGHT_PROP_BASE_ATTACK",
          Type: AttackCurve,
        },
        {
          PropType: "FIGHT_PROP_BASE_DEFENSE",
          Type: DefenseCurve,
        },
      ],
    }
  }
}

let loader: GadgetDataLoader
export default (() => (loader = loader || new GadgetDataLoader()))()
