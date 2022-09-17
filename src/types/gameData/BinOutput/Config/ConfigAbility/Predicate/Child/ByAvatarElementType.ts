import ConfigBaseAbilityPredicate from '.'

export default interface ByAvatarElementType extends ConfigBaseAbilityPredicate {
  $type: 'ByAvatarElementType'
  ElementType: string
}