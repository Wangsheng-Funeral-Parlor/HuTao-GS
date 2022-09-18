import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface TurnDirectionToPos extends ConfigBaseAbilityAction {
  $type: 'TurnDirectionToPos'
  ToPos: ConfigBornType
  MinAngle: number
  MaxAngle: number
}