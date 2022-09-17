import ConfigBaseAbilityAction from '.'

export default interface KillSelf extends ConfigBaseAbilityAction {
  $type: 'KillSelf'
  Duration?: number
  DieStateFlag?: string
  BanDrop?: boolean
  BanExp?: boolean
  BanHPPercentageDrop?: boolean
  KillSelfType: string
  HideEntity?: boolean
}