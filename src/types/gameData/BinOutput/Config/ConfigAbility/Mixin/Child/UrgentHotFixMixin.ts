import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface UrgentHotFixMixin extends ConfigBaseAbilityMixin {
  $type: 'UrgentHotFixMixin'
  LogicId: number
  ThinkInterval: number
  ActionList: ConfigAbilityAction[]
}