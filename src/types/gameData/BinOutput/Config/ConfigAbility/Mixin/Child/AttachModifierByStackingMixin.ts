import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface AttachModifierByStackingMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierByStackingMixin'
  ActionQueue: ConfigAbilityAction[]
  StackingModifier: string
}