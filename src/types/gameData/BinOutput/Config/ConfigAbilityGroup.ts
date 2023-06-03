import ConfigDynamicTalent from "./ConfigDynamicTalent"
import ConfigEntityAbilityEntry from "./ConfigEntityAbilityEntry"

export default interface ConfigAbilityGroup {
  AbilityGroupSourceType: string
  AbilityGroupTargetType: string
  AbilityGroupTargetIDList: number[]
  TargetAbilities: ConfigEntityAbilityEntry[]
  TargetTalents: ConfigDynamicTalent[]
}
