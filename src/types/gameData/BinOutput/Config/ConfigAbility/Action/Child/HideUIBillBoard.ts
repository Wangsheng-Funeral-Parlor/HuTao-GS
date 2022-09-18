import ConfigBaseAbilityAction from '.'

export default interface HideUIBillBoard extends ConfigBaseAbilityAction {
  $type: 'HideUIBillBoard'
  Hide: boolean
}