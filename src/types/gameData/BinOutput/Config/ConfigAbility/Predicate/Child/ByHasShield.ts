import ConfigBaseAbilityPredicate from '.'

export default interface ByHasShield extends ConfigBaseAbilityPredicate {
  $type: 'ByHasShield'
  Type: string
  UsePotentShield: boolean
  PotentShieldType: string
}