import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface EquipAffixStart extends ConfigBaseAbilityAction {
  $type: 'EquipAffixStart'
  CD: DynamicFloat
  EquipAffixDataID: number
}