import ConfigBaseAbilityAction from '.'

export default interface TriggerSetVisible extends ConfigBaseAbilityAction {
  $type: 'TriggerSetVisible'
  Visible: boolean
}