import ConfigBaseAbilityAction from '.'

export default interface TriggerSetPassThrough extends ConfigBaseAbilityAction {
  $type: 'TriggerSetPassThrough'
  PassThrough: boolean
}