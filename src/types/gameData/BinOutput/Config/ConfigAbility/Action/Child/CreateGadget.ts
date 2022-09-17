import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface CreateGadget extends ConfigBaseAbilityAction {
  $type: 'CreateGadget'
  GadgetID: number
  CampID: number
  Born?: ConfigBornType
  CampTargetType?: string
  ByServer?: boolean
}