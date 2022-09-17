import ConfigBaseAbilityPredicate from '.'

export default interface ByIsGadgetExistAround extends ConfigBaseAbilityPredicate {
  $type: 'ByIsGadgetExistAround'
  GadgetIdArray: number[]
  TurnToTarget: boolean
}