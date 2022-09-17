import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByCompareWithTarget extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByCompareWithTarget'
  UseOwner: boolean
  Property: string
}