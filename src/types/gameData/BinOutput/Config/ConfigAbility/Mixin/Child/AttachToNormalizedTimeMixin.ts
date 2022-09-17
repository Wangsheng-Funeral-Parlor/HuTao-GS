import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface AttachToNormalizedTimeMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToNormalizedTimeMixin'
  StateID: string
  ModifierName: string
  Target: string
  Predicates: ConfigAbilityPredicate[]
  NormalizeStart: number
  NormalizeEnd: number
}