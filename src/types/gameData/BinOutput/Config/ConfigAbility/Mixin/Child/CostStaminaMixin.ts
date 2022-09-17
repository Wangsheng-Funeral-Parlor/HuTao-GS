import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface CostStaminaMixin extends ConfigBaseAbilityMixin {
  $type: 'CostStaminaMixin'
  CostStaminaDelta: DynamicFloat
  CostStaminaRatio: DynamicFloat
  OnStaminaEmpty: ConfigAbilityAction[]
}