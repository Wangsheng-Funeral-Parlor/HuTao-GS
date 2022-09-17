import ConfigBaseAbilityPredicate from '.'

export default interface ByHasChildGadget extends ConfigBaseAbilityPredicate {
  $type: 'ByHasChildGadget'
  ConfigIdArray: number[]
  Value: number
  CompareType: string
  ForceByCaster: boolean
  CheckEntityAlive: boolean
}