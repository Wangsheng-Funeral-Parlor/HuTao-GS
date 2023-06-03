import ConfigBaseTalentMixin from "."

export default interface AddTalentExtraLevel extends ConfigBaseTalentMixin {
  $type: "AddTalentExtraLevel"
  TalentType: string | number
  TalentIndex: number
  ExtraLevel: number
}
