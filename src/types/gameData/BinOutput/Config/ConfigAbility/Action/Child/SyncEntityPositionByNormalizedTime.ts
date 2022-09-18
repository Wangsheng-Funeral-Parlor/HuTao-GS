import ConfigBaseAbilityAction from '.'

export default interface SyncEntityPositionByNormalizedTime extends ConfigBaseAbilityAction {
  $type: 'SyncEntityPositionByNormalizedTime'
  NormalizedTime: number
}