import ConfigBaseAbilityPredicate from '.'

export default interface ByHitElement extends ConfigBaseAbilityPredicate {
  $type: 'ByHitElement'
  Element: string
}