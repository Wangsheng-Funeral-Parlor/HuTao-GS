import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface SetAnimatorInt extends ConfigBaseAbilityAction {
  $type: 'SetAnimatorInt'
  IntID: string
  Value: DynamicFloat
  Persistent: boolean
}