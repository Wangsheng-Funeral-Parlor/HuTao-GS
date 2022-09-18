import ConfigBaseAbilityAction from '.'

export default interface TriggerHideWeapon extends ConfigBaseAbilityAction {
  $type: 'TriggerHideWeapon'
  Visible: boolean
  PartNames: string[]
}