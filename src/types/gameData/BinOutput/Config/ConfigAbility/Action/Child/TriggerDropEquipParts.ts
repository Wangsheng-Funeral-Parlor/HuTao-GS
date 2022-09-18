import ConfigBaseAbilityAction from '.'

export default interface TriggerDropEquipParts extends ConfigBaseAbilityAction {
  $type: 'TriggerDropEquipParts'
  DropAll: boolean
  EquipParts: string[]
}