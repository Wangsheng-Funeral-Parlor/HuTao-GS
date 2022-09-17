import SelectTargets from '$DT/BinOutput/Config/SelectTargets'
import ConfigAbilityPredicate from '../../Predicate'

export default interface ConfigBaseAbilityAction {
  Target?: string
  OtherTargets?: SelectTargets
  DoOffStage?: boolean
  DoAfterDie?: boolean
  CanBeHandledOnRecover?: boolean
  MuteRemoteAction?: boolean
  Predicates?: ConfigAbilityPredicate[]
  PredicatesForeach?: ConfigAbilityPredicate[]
}