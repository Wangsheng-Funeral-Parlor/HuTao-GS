import ConfigBaseAbilityPredicate from '.'

export default interface ByHitElementDurability extends ConfigBaseAbilityPredicate {
  $type: 'ByHitElementDurability'
  Element: string
  Durability: number
  CompareType: string
  ApplyAttenuation: boolean
}