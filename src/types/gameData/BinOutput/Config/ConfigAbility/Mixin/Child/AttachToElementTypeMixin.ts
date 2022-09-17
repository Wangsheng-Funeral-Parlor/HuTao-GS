import ConfigBaseAbilityMixin from '.'

export default interface AttachToElementTypeMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToElementTypeMixin'
  ElementTypes: string[]
  Reject: boolean
  ModifierName: string
}