import ConfigBaseAbilityPredicate from '.'

export default interface ByHasTag extends ConfigBaseAbilityPredicate {
  $type: 'ByHasTag'
  Tag: string
}