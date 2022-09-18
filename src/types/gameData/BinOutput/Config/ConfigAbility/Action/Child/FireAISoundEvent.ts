import ConfigBaseAbilityAction from '.'

export default interface FireAISoundEvent extends ConfigBaseAbilityAction {
  $type: 'FireAISoundEvent'
  Volume: number
}