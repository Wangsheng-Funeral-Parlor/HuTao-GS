import ConfigBaseAbilityAction from '.'

export default interface SetSelfAttackTarget extends ConfigBaseAbilityAction {
  $type: 'SetSelfAttackTarget'
  TurnToTargetImmediately: boolean
  TurnToTargetKeepUpAxisDirection: boolean
}