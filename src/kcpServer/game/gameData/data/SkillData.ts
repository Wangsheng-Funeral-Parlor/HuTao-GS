import Loader from '$/gameData/loader'
import SkillDataGroup, { SkillDepotData, SkillData, ProudSkillData, TalentData } from '@/types/gameData/SkillData'

class SkillDataLoader extends Loader {
  declare data: SkillDataGroup

  constructor() {
    super('SkillData')
  }

  getSkillDepot(id: number): SkillDepotData {
    return this.data?.Depot?.find(data => data.Id === id)
  }

  getSkill(id: number): SkillData {
    return this.data?.Skill?.find(data => data.Id === id)
  }

  getProudSkill(id: number): ProudSkillData {
    return this.data?.ProudSkill?.find(data => data.Id === id)
  }

  getProudSkillByGroup(groupId: number, level?: number): ProudSkillData {
    return this.data?.ProudSkill?.find(data => data.GroupId === groupId && (level == null || data.Level === level))
  }

  getTalent(id: number): TalentData {
    return this.data?.Talent?.find(data => data.Id === id)
  }
}

let loader: SkillDataLoader
export default (() => loader = loader || new SkillDataLoader())()