import ConfigBaseAbilityAction from '.'

export default interface TriggerSetChestLock extends ConfigBaseAbilityAction {
  $type: 'TriggerSetChestLock'
  Locked: boolean
}