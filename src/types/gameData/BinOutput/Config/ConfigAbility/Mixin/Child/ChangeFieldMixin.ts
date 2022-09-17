import ConfigBaseAbilityMixin from '.'

export default interface ChangeFieldMixin extends ConfigBaseAbilityMixin {
  $type: 'ChangeFieldMixin'
  Type: string
  TargetRadius: number
  Time: number
}