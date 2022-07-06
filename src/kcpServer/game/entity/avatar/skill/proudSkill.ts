import SkillData from '$/gameData/data/SkillData'
import SkillUserData from '@/types/user/SkillUserData'
import Skill from './skill'

export default class ProudSkill {
  skill: Skill
  groupId: number
  level: number
  id: number

  constructor(skill: Skill, groupId: number) {
    this.skill = skill
    this.groupId = groupId
  }

  async init(userData: SkillUserData) {
    const { level } = userData

    this.level = level

    await this.update()
  }

  async initNew() {
    this.level = 1

    await this.update()
  }

  async update() {
    const { groupId, level } = this
    const proudSkillData = await SkillData.getProudSkillByGroup(groupId, level)

    this.id = proudSkillData?.Id || 0
  }

  exportUserData(): SkillUserData {
    const { id, level } = this

    return {
      id,
      level,
      proudSkillData: false
    }
  }
}