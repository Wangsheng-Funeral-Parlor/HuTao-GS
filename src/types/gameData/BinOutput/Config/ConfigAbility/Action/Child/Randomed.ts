import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'
import ConfigAbilityAction from '..'

export default interface Randomed extends ConfigBaseAbilityAction {
  $type: 'Randomed'
  Chance: DynamicFloat
  SuccessActions: ConfigAbilityAction[]
  FailActions: ConfigAbilityAction[]
}