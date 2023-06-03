import Loader from "$/gameData/loader"
import { EntityFightPropConfig } from "@/types/game"
import MonsterDataGroup, {
  MonsterAffixData,
  MonsterData,
  MonsterDescribeData,
  MonsterSpecialNameData,
} from "@/types/gameData/MonsterData"

class MonsterDataLoader extends Loader {
  declare data: MonsterDataGroup

  constructor() {
    super("MonsterData", "message.cache.debug.monster")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getMonster(id: number, silent = false): MonsterData {
    const data = this.getMonsterList().find((data) => data.Id === id)
    if (!silent) {
      if (data == null) this.warn("message.loader.monsterData.warn.noData", id)
    }
    return data
  }

  getMonsterList(): MonsterData[] {
    return this.data?.Monster || []
  }

  getAffix(id: number): MonsterAffixData {
    return this.getAffixList().find((data) => data.Id === id)
  }

  getAffixList(): MonsterAffixData[] {
    return this.data?.Affix || []
  }

  getDescribe(id: number): MonsterDescribeData {
    return this.getDescribeList().find((data) => data.Id === id)
  }

  getDescribeList(): MonsterDescribeData[] {
    return this.data?.Describe || []
  }

  getSpecialName(labId: number): MonsterSpecialNameData {
    return this.getSpecialNameList().find((data) => data.LabId === labId)
  }

  getSpecialNameList(): MonsterSpecialNameData[] {
    return this.data?.SpecialName || []
  }

  getFightPropConfig(id: number): EntityFightPropConfig {
    const data = this.getMonster(id, true)
    if (!data) {
      this.warn("message.loader.monsterData.warn.noFightPropConfig", id)

      return {
        HpBase: 0,
        AttackBase: 0,
        DefenseBase: 0,
        IceSubHurt: 0,
        GrassSubHurt: 0,
        WindSubHurt: 0,
        ElecSubHurt: 0,
        PhysicalSubHurt: 0,
        PropGrowCurves: [],
      }
    }

    const {
      HpBase,
      AttackBase,
      DefenseBase,
      IceSubHurt,
      GrassSubHurt,
      WindSubHurt,
      ElecSubHurt,
      PhysicalSubHurt,
      PropGrowCurves,
    } = data

    return {
      HpBase,
      AttackBase,
      DefenseBase,
      IceSubHurt,
      GrassSubHurt,
      WindSubHurt,
      ElecSubHurt,
      PhysicalSubHurt,
      PropGrowCurves: PropGrowCurves.map((c) => ({
        PropType: c.Type,
        Type: c.GrowCurve,
      })),
    }
  }
}

let loader: MonsterDataLoader
export default (() => (loader = loader || new MonsterDataLoader()))()
