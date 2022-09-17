import ConfigBaseAbilityPredicate from '.'

export default interface ByHasComponentTag extends ConfigBaseAbilityPredicate {
  $type: 'ByHasComponentTag'
  Tags: string[]
}