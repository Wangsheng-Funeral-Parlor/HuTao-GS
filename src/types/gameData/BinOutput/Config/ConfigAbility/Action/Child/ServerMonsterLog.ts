import ConfigBaseAbilityAction from '.'

export default interface ServerMonsterLog extends ConfigBaseAbilityAction {
  $type: 'ServerMonsterLog'
  ParamList: number[]
}