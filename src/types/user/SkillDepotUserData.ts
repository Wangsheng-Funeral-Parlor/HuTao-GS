import SkillUserData from "./SkillUserData"

export default interface SkillDepotUserData {
  id: number
  skillDataList: SkillUserData[]
  energySkillData: SkillUserData | false
}
