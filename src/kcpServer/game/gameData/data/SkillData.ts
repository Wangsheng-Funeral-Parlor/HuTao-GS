import Loader from "$/gameData/loader"
import SkillDataGroup, { ProudSkillData, SkillData, SkillDepotData } from "@/types/gameData/SkillData"

class SkillDataLoader extends Loader {
  declare data: SkillDataGroup

  constructor() {
    super("SkillData", "message.cache.debug.skill")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getSkillDepot(id: number): SkillDepotData {
    return this.data?.Depot?.find((data) => data.Id === id)
  }

  getSkill(id: number): SkillData {
    return this.data?.Skill?.find((data) => data.Id === id)
  }

  getProudSkill(id: number): ProudSkillData {
    return this.data?.ProudSkill?.find((data) => data.Id === id)
  }

  getProudSkillByGroup(groupId: number, level?: number): ProudSkillData {
    return this.data?.ProudSkill?.find((data) => data.GroupId === groupId && (level == null || data.Level === level))
  }
}

let loader: SkillDataLoader
export default (() => (loader = loader || new SkillDataLoader()))()
