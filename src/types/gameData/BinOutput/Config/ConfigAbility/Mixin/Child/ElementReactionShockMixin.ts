import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface ElementReactionShockMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementReactionShockMixin'
  ThinkInterval: number
  CampGlobalKey: string
  AttackAction: ConfigAbilityAction
  ConductAction: ConfigAbilityAction
}