import ConfigBaseAbilityPredicate from '.'

export default interface ByEquipAffixReady extends ConfigBaseAbilityPredicate {
  $type: 'ByEquipAffixReady'
  EquipAffixDataID: number
}