import ConfigBaseAbilityPredicate from '.'

export default interface ByBigTeamHasWeaponType extends ConfigBaseAbilityPredicate {
  $type: 'ByBigTeamHasWeaponType'
  WeaponType: string
  Number: number
  Logic: string
}