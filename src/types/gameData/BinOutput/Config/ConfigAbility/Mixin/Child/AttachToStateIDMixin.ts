import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface AttachToStateIDMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToStateIDMixin'
  StateIDs: string[]
  ModifierName: string
  Target: string
  Predicates: ConfigAbilityPredicate[]
  IsCheckOnAttach: boolean
}