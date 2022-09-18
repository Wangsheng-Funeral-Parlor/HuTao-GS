import { DynamicInt } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'
import ConfigAbilityAction from '..'

export default interface Repeated extends ConfigBaseAbilityAction {
  $type: 'Repeated'
  RepeatTimes: DynamicInt
  Actions: ConfigAbilityAction[]
}