import Loader from '$/gameData/loader'
import { EntityFightPropConfig } from '@/types/game/entity'
import MonsterDataGroup, { MonsterAffixData, MonsterData, MonsterDescribeData, MonsterSpecialNameData } from '@/types/gameData/MonsterData'

class MonsterDataLoader extends Loader {
  declare data: MonsterDataGroup

  constructor() {
    super('MonsterData')
  }

  async getData(): Promise<MonsterDataGroup> {
    return super.getData()
  }

  async getMonster(id: number): Promise<MonsterData> {
    return (await this.getMonsterList()).find(data => data.Id === id)
  }

  async getMonsterList(): Promise<MonsterData[]> {
    return (await this.getData())?.Monster || []
  }

  async getAffix(id: number): Promise<MonsterAffixData> {
    return (await this.getAffixList()).find(data => data.Id === id)
  }

  async getAffixList(): Promise<MonsterAffixData[]> {
    return (await this.getData())?.Affix || []
  }

  async getDescribe(id: number): Promise<MonsterDescribeData> {
    return (await this.getDescribeList()).find(data => data.Id === id)
  }

  async getDescribeList(): Promise<MonsterDescribeData[]> {
    return (await this.getData())?.Describe || []
  }

  async getSpecialName(labId: number): Promise<MonsterSpecialNameData> {
    return (await this.getSpecialNameList()).find(data => data.LabId === labId)
  }

  async getSpecialNameList(): Promise<MonsterSpecialNameData[]> {
    return (await this.getData())?.SpecialName || []
  }

  async getFightPropConfig(id: number): Promise<EntityFightPropConfig> {
    const data = await this.getMonster(id)
    if (!data) {
      return {
        HpBase: 0,
        AttackBase: 0,
        DefenseBase: 0,
        IceSubHurt: 0,
        GrassSubHurt: 0,
        WindSubHurt: 0,
        ElecSubHurt: 0,
        PhysicalSubHurt: 0,
        PropGrowCurves: []
      }
    }

    const { HpBase, AttackBase, DefenseBase, IceSubHurt, GrassSubHurt, WindSubHurt, ElecSubHurt, PhysicalSubHurt, PropGrowCurves } = data

    return {
      HpBase,
      AttackBase,
      DefenseBase,
      IceSubHurt,
      GrassSubHurt,
      WindSubHurt,
      ElecSubHurt,
      PhysicalSubHurt,
      PropGrowCurves: PropGrowCurves.map(c => ({
        PropType: c.Type,
        Type: c.GrowCurve
      }))
    }
  }
}

let loader: MonsterDataLoader
export default (() => loader = loader || new MonsterDataLoader())()