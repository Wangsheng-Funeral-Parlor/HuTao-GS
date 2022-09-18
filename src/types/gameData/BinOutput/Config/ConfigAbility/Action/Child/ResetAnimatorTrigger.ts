import ConfigBaseAbilityAction from '.'

export default interface ResetAnimatorTrigger extends ConfigBaseAbilityAction {
  $type: 'ResetAnimatorTrigger'
  TriggerID: string
}