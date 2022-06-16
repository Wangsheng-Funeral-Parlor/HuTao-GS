import SkillUserData from './SkillUserData'

export default interface SkillDepotUserData {
  skillDataList: SkillUserData[]
  energySkillData: SkillUserData | false
}