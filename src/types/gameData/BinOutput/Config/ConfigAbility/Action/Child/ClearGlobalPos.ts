import ConfigBaseAbilityAction from '.'

export default interface ClearGlobalPos extends ConfigBaseAbilityAction {
  $type: 'ClearGlobalPos'
  Key: string
  SetTarget: boolean
}