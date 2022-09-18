import ConfigBaseAbilityAction from '.'

export default interface SetWeaponAttachPointRealName extends ConfigBaseAbilityAction {
  $type: 'SetWeaponAttachPointRealName'
  PartName: string
  RealName: string
}