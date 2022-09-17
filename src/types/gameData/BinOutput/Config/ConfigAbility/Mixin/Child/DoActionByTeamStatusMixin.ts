import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'
import ConfigAbilityPredicate from '../../Predicate'

export default interface DoActionByTeamStatusMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByTeamStatusMixin'
  Actions: ConfigAbilityAction[]
  Predicates: ConfigAbilityPredicate[]
}