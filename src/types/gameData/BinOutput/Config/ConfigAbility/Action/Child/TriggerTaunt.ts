import ConfigBaseAbilityAction from '.'

export default interface TriggerTaunt extends ConfigBaseAbilityAction {
  $type: 'TriggerTaunt'
  TauntLevel: string
  CareValue: number
}