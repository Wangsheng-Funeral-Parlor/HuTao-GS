import ConfigBaseAbilityPredicate from '.'

export default interface ByCurTeamHasWeaponType extends ConfigBaseAbilityPredicate {
  $type: 'ByCurTeamHasWeaponType'
  WeaponType: string
  Number: number
  Logic: string
}