import ConfigAbilityAction from "./ConfigAbility/Action"
import ConfigAbilityMixin from "./ConfigAbility/Mixin"
import ConfigAbilityModifier from "./ConfigAbilityModifier"

export default interface ConfigAbility {
  $type: "ConfigAbility"
  AbilityName: string
  AbilityMixins: ConfigAbilityMixin[]
  AbilitySpecials: { [key: string]: object }
  Modifiers: { [key: string]: ConfigAbilityModifier }
  DefaultModifier: ConfigAbilityModifier
  OnAdded: ConfigAbilityAction[]
  OnRemoved: ConfigAbilityAction[]
  OnAbilityStart: ConfigAbilityAction[]
  OnKill: ConfigAbilityAction[]
  OnFieldEnter: ConfigAbilityAction[]
  OnFieldExit: ConfigAbilityAction[]
  OnAttach: ConfigAbilityAction[]
  OnDetach: ConfigAbilityAction[]
  OnAvatarIn: ConfigAbilityAction[]
  OnAvatarOut: ConfigAbilityAction[]
  OnTriggerAvatarRay: ConfigAbilityAction[]
  IsDynamicAbility: boolean
}
