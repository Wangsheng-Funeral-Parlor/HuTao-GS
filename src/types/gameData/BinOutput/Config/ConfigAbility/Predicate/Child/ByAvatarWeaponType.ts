import ConfigBaseAbilityPredicate from '.'

export default interface ByAvatarWeaponType extends ConfigBaseAbilityPredicate {
  $type: 'ByAvatarWeaponType'
  WeaponTypes: string[]
}