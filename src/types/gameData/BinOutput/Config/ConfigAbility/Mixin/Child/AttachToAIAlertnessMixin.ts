import ConfigBaseAbilityMixin from '.'

export default interface AttachToAIAlertnessMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToAIAlertnessMixin'
  Alertness: number[]
  ModifierName: string
}