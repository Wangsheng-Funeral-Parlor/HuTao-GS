import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface ResetAIThreatBroadcastRange extends ConfigBaseAbilityAction {
  $type: 'ResetAIThreatBroadcastRange'
  Range: DynamicFloat
}