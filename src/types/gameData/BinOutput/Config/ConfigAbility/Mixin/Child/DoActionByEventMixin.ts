import ConfigAbilityStateToActions from '$DT/BinOutput/Config/ConfigAbilityStateToActions'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'
import ConfigAbilityPredicate from '../../Predicate'

export default interface DoActionByEventMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByEventMixin'
  Type: string
  OnEvent: string
  PickItemConfigIDs: number[]
  Predicates: ConfigAbilityPredicate[]
  Actions: ConfigAbilityAction[]
  OnAbilityStateAdded: ConfigAbilityStateToActions[]
  OnAbilityStateRemoved: ConfigAbilityStateToActions[]
}