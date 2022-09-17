import ConfigBaseAbilityMixin from '.'

export default interface AttachToGadgetStateMutexMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToGadgetStateMutexMixin'
  GadgetStates: number[]
  ModifierNames: string[]
}