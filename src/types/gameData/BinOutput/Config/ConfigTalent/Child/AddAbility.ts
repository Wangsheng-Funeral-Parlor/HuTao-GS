import ConfigBaseTalentMixin from "."

export default interface AddAbility extends ConfigBaseTalentMixin {
  $type: "AddAbility"
  AbilityName: string
}
