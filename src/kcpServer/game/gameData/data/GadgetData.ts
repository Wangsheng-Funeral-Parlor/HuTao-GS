import Loader from '$/gameData/loader'
import { EntityFightPropConfig } from '@/types/game'
import GadgetDataGroup, { GadgetData, GadgetPropData } from '@/types/gameData/GadgetData'

class GadgetDataLoader extends Loader {
  declare data: GadgetDataGroup

  constructor() {
    super('GadgetData')
  }

  async getData(): Promise<GadgetDataGroup> {
    return super.getData()
  }

  async getGadget(id: number): Promise<GadgetData> {
    return (await this.getGadgetList()).find(data => data.Id === id)
  }

  async getGadgetList(): Promise<GadgetData[]> {
    return (await this.getData()).Gadget || []
  }

  async getProp(id: number): Promise<GadgetPropData> {
    return (await this.getPropList()).find(data => data.Id === id)
  }

  async getPropList(): Promise<GadgetPropData[]> {
    return (await this.getData()).Prop || []
  }

  async getFightPropConfig(id: number): Promise<EntityFightPropConfig> {
    const data = await this.getProp(id)
    if (!data) {
      return {
        HpBase: 0,
        AttackBase: 0,
        DefenseBase: 0,
        PropGrowCurves: []
      }
    }

    const { Hp, Attack, Defense, HpCurve, AttackCurve, DefenseCurve } = data

    return {
      HpBase: Hp,
      AttackBase: Attack,
      DefenseBase: Defense,
      PropGrowCurves: [
        {
          PropType: 'FIGHT_PROP_BASE_HP',
          Type: HpCurve
        },
        {
          PropType: 'FIGHT_PROP_BASE_ATTACK',
          Type: AttackCurve
        },
        {
          PropType: 'FIGHT_PROP_BASE_DEFENSE',
          Type: DefenseCurve
        }
      ]
    }
  }
}

let loader: GadgetDataLoader
export default (() => loader = loader || new GadgetDataLoader())()