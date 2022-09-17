import ConfigBaseAbilityAction from '.'

export default interface TurnDirection extends ConfigBaseAbilityAction {
  $type: 'TurnDirection'
  TurnMode: string
}