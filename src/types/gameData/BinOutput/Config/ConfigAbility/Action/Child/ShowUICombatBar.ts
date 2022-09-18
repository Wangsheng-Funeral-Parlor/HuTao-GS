import ConfigBaseAbilityAction from '.'

export default interface ShowUICombatBar extends ConfigBaseAbilityAction {
  $type: 'ShowUICombatBar'
  Show: boolean
  Fore: boolean
}