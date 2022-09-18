import ConfigBaseAbilityAction from '.'

export default interface ServerLuaCall extends ConfigBaseAbilityAction {
  $type: 'ServerLuaCall'
  LuaCallType: string
  IsTarget: boolean
  CallParamList: number[]
  FuncName: string
}