import ConfigBaseAbilityMixin from '.'

export default interface AttachToGadgetStateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToGadgetStateMixin'
  GadgetState: number
  ModifierName: string
}