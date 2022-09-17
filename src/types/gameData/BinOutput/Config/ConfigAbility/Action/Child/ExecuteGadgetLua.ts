import ConfigBaseAbilityAction from '.'

export default interface ExecuteGadgetLua extends ConfigBaseAbilityAction {
  $type: 'ExecuteGadgetLua'
  Param1?: number
  Param2?: number
  Param3?: number
}