import ConfigBaseAbilityMixin from '.'

export default interface AttachToPoseIDMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToPoseIDMixin'
  PoseIDs: number[]
  ModifierName: string
}