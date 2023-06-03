import ConfigBaseTalentMixin from "."

export default interface ModifySkillCost extends ConfigBaseTalentMixin {
  $type: "ModifySkillCost"
  SkillID: number
  CostDelta: number
  CostRatio: number
}
