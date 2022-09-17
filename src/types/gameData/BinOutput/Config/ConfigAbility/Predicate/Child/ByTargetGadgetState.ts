import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetGadgetState extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetGadgetState'
  GadgetState: number
}