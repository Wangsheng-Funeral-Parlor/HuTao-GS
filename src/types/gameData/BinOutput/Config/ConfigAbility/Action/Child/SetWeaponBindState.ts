import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface SetWeaponBindState extends ConfigBaseAbilityAction {
  $type: 'SetWeaponBindState'
  Place: boolean
  EquipPartName: string
  Born: ConfigBornType
}