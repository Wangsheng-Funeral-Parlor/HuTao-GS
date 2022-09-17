import ConfigBaseAbilityPredicate from '.'
import ConfigAbilityPredicate from '..'

export default interface ByNot extends ConfigBaseAbilityPredicate {
  $type: 'ByNot'
  Predicates: ConfigAbilityPredicate[]
}