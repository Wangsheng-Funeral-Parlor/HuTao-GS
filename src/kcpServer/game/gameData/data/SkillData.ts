import Loader from '$/gameData/loader'
import SkillDataGroup, { ProudSkillData, SkillData, SkillDepotData } from '@/types/gameData/SkillData'

class SkillDataLoader extends Loader {
  declare data: SkillDataGroup

  constructor() {
    super('SkillData')
  }

  async getData(): Promise<SkillDataGroup> {
    return super.getData()
  }

  async getSkillDepot(id: number): Promise<SkillDepotData> {
    return (await this.getData())?.Depot?.find(data => data.Id === id)
  }

  async getSkill(id: number): Promise<SkillData> {
    return (await this.getData())?.Skill?.find(data => data.Id === id)
  }

  async getProudSkill(id: number): Promise<ProudSkillData> {
    return (await this.getData())?.ProudSkill?.find(data => data.Id === id)
  }

  async getProudSkillByGroup(groupId: number, level?: number): Promise<ProudSkillData> {
    return (await this.getData())?.ProudSkill?.find(data => data.GroupId === groupId && (level == null || data.Level === level))
  }
}

let loader: SkillDataLoader
export default (() => loader = loader || new SkillDataLoader())()