import ConfigBaseAbilityAction from '.'

export default interface TriggerAuxWeaponTrans extends ConfigBaseAbilityAction {
  $type: 'TriggerAuxWeaponTrans'
  SetEnable: boolean
  EquipPart: string
}