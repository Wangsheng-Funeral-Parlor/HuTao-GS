import ConfigBaseAbilityMixin from '.'

export default interface AttachToAbilityStateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToAbilityStateMixin'
  AbilityStates: string[]
  Reject: boolean
  ModifierName: string
}