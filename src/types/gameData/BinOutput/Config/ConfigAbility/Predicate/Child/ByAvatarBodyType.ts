import ConfigBaseAbilityPredicate from '.'

export default interface ByAvatarBodyType extends ConfigBaseAbilityPredicate {
  $type: 'ByAvatarBodyType'
  BodyType: string
}