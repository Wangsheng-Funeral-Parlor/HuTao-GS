import { ElemTypeEnum } from '@/types/enum/skill'
import SkillDepot from './skillDepot'
import ProudSkill from './proudSkill'
import SkillData from '$/gameData/data/SkillData'
import SkillUserData from '@/types/user/SkillUserData'

export default class Skill {
  depot: SkillDepot
  id: number
  level: number
  proudSkill?: ProudSkill

  costStamina: number
  costElemType?: ElemTypeEnum
  costElemVal: number

  constructor(depot: SkillDepot, skillId: number) {
    this.depot = depot
    this.id = skillId

    const { ProudSkillGroupId, CostStamina, CostElemType, CostElemVal } = SkillData.getSkill(skillId)
    if (ProudSkillGroupId != null) this.proudSkill = new ProudSkill(this, ProudSkillGroupId)
    this.costStamina = CostStamina || 0
    this.costElemType = ElemTypeEnum[(CostElemType || '').toUpperCase()] || 0
    this.costElemVal = CostElemVal || 0
  }

  init(userData: SkillUserData) {
    const { id, level, proudSkillData } = userData
    if (this.id !== id) return this.initNew()

    this.level = level || 1

    if (!this.proudSkill) return

    if (proudSkillData) this.proudSkill.init(proudSkillData)
    else this.proudSkill.initNew()
  }

  initNew() {
    this.level = 1

    if (this.proudSkill) this.proudSkill.initNew()
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