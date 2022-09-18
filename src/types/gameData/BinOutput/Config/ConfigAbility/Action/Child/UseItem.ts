import ConfigBaseAbilityAction from '.'

export default interface UseItem extends ConfigBaseAbilityAction {
  $type: 'UseItem'
  ItemId: number
  ItemNum: number
}