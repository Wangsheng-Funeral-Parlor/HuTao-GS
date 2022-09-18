import ConfigBaseAbilityAction from '.'

export default interface CallLuaTask extends ConfigBaseAbilityAction {
  $type: 'CallLuaTask'
  TargetAlias: string
  ValueInt: number
  ValueFloat: number
  ValueString: string
}