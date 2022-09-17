import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface WeightDetectRegionMixin extends ConfigBaseAbilityMixin {
  $type: 'WeightDetectRegionMixin'
  GlobalValueKey: string
  OnWeightChanged: ConfigAbilityAction[]
}