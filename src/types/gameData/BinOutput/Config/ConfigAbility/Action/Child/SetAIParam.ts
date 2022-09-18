import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface SetAIParam extends ConfigBaseAbilityAction {
  $type: 'SetAIParam'
  Param: string
  Value: DynamicFloat
  IsBool: boolean
  LogicType: string
}