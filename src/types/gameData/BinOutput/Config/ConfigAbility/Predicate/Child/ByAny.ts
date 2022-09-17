import ConfigBaseAbilityPredicate from '.'
import ConfigAbilityPredicate from '..'

export default interface ByAny extends ConfigBaseAbilityPredicate {
  $type: 'ByAny'
  Predicates: ConfigAbilityPredicate[]
}