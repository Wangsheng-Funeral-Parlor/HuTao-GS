import ConfigBaseAbilityPredicate from '.'

export default interface ByHasElement extends ConfigBaseAbilityPredicate {
  $type: 'ByHasElement'
  Element: string
}