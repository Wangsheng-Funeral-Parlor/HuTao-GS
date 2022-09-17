import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetConfigID extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetConfigID'
  ConfigIdArray: number[]
}