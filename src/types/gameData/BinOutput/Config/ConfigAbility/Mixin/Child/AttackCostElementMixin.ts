import ConfigBaseAbilityMixin from '.'

export default interface AttackCostElementMixin extends ConfigBaseAbilityMixin {
  $type: 'AttackCostElementMixin'
  StrikeType: string
  ElementType: string
  AttackType: string
  StrikeCostRatio: number
  AttackCostRatio: number
  ElementCostRatio: number
  CostElementType: string
  CostType: string
}