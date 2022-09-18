import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface SetCombatFixedMovePoint extends ConfigBaseAbilityAction {
  $type: 'SetCombatFixedMovePoint'
  SetPoint: boolean
  ToPos: ConfigBornType
}