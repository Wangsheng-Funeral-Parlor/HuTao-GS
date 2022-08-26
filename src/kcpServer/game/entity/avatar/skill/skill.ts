import Embryo from '$/ability/embryo'
import SkillData from '$/gameData/data/SkillData'
import { ElemTypeEnum } from '@/types/enum'
import SkillUserData from '@/types/user/SkillUserData'
import ProudSkill from './proudSkill'
import SkillDepot from './skillDepot'

export default class Skill {
  depot: SkillDepot
  id: number
  level: number
  proudSkill?: ProudSkill

  costStamina: number
  costElemType?: ElemTypeEnum
  costElemVal: number

  abilityName: string | null
  abilityEmbryo: Embryo

  constructor(depot: SkillDepot, skillId: number) {
    this.depot = depot
    this.id = skillId

    this.costStamina = 0
    this.costElemType = 0
    this.costElemVal = 0

    this.abilityName = null
  }

  async init(userData: SkillUserData) {
    const { id, level, proudSkillData } = userData
    if (this.id !== id) return this.initNew()

    this.level = level || 1

    const { AbilityName, ProudSkillGroupId, CostStamina, CostElemType, CostElemVal } = await SkillData.getSkill(id)

    this.costStamina = CostStamina || 0
    this.costElemType = ElemTypeEnum[(CostElemType || '').toUpperCase()] || 0
    this.costElemVal = CostElemVal || 0

    this.abilityName = AbilityName || null

    if (ProudSkillGroupId == null) return

    this.proudSkill = new ProudSkill(this, ProudSkillGroupId)

    if (proudSkillData) await this.proudSkill.init(proudSkillData)
    else await this.proudSkill.initNew()
  }

  async initNew() {
    const { id } = this

    this.level = 1

    const { AbilityName, ProudSkillGroupId, CostStamina, CostElemType, CostElemVal } = await SkillData.getSkill(id)

    this.costStamina = CostStamina || 0
    this.costElemType = ElemTypeEnum[(CostElemType || '').toUpperCase()] || 0
    this.costElemVal = CostElemVal || 0

    this.abilityName = AbilityName || null

    if (ProudSkillGroupId == null) return

    this.proudSkill = new ProudSkill(this, ProudSkillGroupId)

    await this.proudSkill.initNew()
  }

  exportUserData(): SkillUserData {
    const { id, level, proudSkill } = this

    return {
      id,
      level,
      proudSkillData: proudSkill?.exportUserData() || false
    }
  }
}