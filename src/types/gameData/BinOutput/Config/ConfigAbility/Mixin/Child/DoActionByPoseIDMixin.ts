import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'
import ConfigAbilityPredicate from '../../Predicate'

export default interface DoActionByPoseIDMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByPoseIDMixin'
  PoseIDs: number[]
  EnterPredicates: ConfigAbilityPredicate[]
  ExitPredicates: ConfigAbilityPredicate[]
  EnterActions: ConfigAbilityAction[]
  ExitActions: ConfigAbilityAction[]
}