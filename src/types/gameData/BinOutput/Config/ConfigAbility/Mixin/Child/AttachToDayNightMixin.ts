import ConfigBaseAbilityMixin from '.'

export default interface AttachToDayNightMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToDayNightMixin'
  Time: string
  ModifierName: string
}