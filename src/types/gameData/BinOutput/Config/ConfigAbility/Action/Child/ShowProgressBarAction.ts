import ConfigBaseAbilityAction from '.'

export default interface ShowProgressBarAction extends ConfigBaseAbilityAction {
  $type: 'ShowProgressBarAction'
  Show: boolean
}