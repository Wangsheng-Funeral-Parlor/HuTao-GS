import ConfigBaseAbilityAction from '.'

export default interface SetAnimatorTrigger extends ConfigBaseAbilityAction {
  $type: 'SetAnimatorTrigger'
  TriggerID: string
  MPTriggerOnRemote: boolean
}