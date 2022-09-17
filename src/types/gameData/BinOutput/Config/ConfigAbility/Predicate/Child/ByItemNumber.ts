import ConfigBaseAbilityPredicate from '.'

export default interface ByItemNumber extends ConfigBaseAbilityPredicate {
  $type: 'ByItemNumber'
  ItemId: number
  ItemNum: number
}