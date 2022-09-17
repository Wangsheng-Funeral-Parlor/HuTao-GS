import ConfigBaseAbilityPredicate from '.'

export default interface ByTargetElement extends ConfigBaseAbilityPredicate {
  $type: 'ByTargetElement'
  ElementType: string
}