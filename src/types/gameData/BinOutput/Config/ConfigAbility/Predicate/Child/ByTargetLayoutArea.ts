import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetLayoutArea extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetLayoutArea'
  AreaType: string
  ClimateType: string
  AreaID: number
}