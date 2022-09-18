import ConfigBaseAbilityAction from '.'

export default interface ExecuteGroupTrigger extends ConfigBaseAbilityAction {
  $type: 'ExecuteGroupTrigger'
  SourceName: string
  Param1: number
  Param2: number
  Param3: number
}