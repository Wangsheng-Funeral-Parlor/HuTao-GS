import ConfigBaseAbilityAction from '.'

export default interface SetCanDieImmediately extends ConfigBaseAbilityAction {
  $type: 'SetCanDieImmediately'
  DieImmediately: boolean
}