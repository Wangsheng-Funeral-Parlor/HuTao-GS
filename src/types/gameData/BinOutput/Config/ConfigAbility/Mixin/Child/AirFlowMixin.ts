import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityMixin from '.'

export default interface AirFlowMixin extends ConfigBaseAbilityMixin {
  $type: 'AirFlowMixin'
  GadgetID: number
  CampID: number
  CampTargetType: string
  Born: ConfigBornType
}