import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface ClusterTriggerMixin extends ConfigBaseAbilityMixin {
  $type: 'ClusterTriggerMixin'
  Born: ConfigBornType
  ConfigID: number
  Radius: number
  Duration: number
  ValueSteps: DynamicFloat[]
  ActionQueue: ConfigAbilityAction[]
}