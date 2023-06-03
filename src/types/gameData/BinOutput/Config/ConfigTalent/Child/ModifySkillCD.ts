import ConfigBaseTalentMixin from "."

export default interface ModifySkillCD extends ConfigBaseTalentMixin {
  $type: "ModifySkillCD"
  SkillID: number
  CdDelta: number
  CdRatio: number
}
