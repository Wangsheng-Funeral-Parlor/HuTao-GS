import ConfigTimeSlow from '$DT/BinOutput/Config/ConfigTimeSlow'
import ConfigBaseAbilityAction from '.'

export default interface ActTimeSlow extends ConfigBaseAbilityAction {
  $type: 'ActTimeSlow'
  TimeSlow: ConfigTimeSlow
  IsGlobal: boolean
}