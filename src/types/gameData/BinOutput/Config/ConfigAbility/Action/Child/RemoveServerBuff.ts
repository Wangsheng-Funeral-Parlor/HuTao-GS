import ConfigBaseAbilityAction from '.'

export default interface RemoveServerBuff extends ConfigBaseAbilityAction {
  $type: 'RemoveServerBuff'
  SBuffId: number
  IsTeamBuff: boolean
}