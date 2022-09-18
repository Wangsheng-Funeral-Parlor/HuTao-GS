import ConfigBaseAbilityAction from '.'

export default interface EnableHitAutoRedirect extends ConfigBaseAbilityAction {
  $type: 'EnableHitAutoRedirect'
  SetEnable: boolean
}