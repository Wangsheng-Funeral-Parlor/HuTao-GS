import ConfigBaseAbilityAction from '.'

export default interface BanEntityMark extends ConfigBaseAbilityAction {
  $type: 'BanEntityMark'
  IsBan: boolean
}