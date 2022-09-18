import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface RushMove extends ConfigBaseAbilityAction {
  $type: 'RushMove'
  ToPos: ConfigBornType
  MinRange: number
  MaxRange: number
  TimeRange: number
}