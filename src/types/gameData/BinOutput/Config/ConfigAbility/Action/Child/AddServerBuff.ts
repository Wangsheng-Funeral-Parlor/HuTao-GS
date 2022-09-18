import ConfigBaseAbilityAction from '.'

export default interface AddServerBuff extends ConfigBaseAbilityAction {
  $type: 'AddServerBuff'
  SBuffId: number
  Time: number
}