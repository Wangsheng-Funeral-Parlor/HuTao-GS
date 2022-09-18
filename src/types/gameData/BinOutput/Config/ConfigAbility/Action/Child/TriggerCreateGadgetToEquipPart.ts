import ConfigBaseAbilityAction from '.'

export default interface TriggerCreateGadgetToEquipPart extends ConfigBaseAbilityAction {
  $type: 'TriggerCreateGadgetToEquipPart'
  GadgetID: number
  EquipPart: string
}