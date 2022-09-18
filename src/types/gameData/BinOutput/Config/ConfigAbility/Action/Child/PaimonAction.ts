import ConfigBaseAbilityAction from '.'

export default interface PaimonAction extends ConfigBaseAbilityAction {
  $type: 'PaimonAction'
  From: string
  ActionName: string
}