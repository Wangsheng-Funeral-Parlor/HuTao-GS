import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DoActionByCreateGadgetMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByCreateGadgetMixin'
  Type: string
  ActionQueue: ConfigAbilityAction[]
}