import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface SetGlobalPos extends ConfigBaseAbilityAction {
  $type: 'SetGlobalPos'
  Key: string
  Born: ConfigBornType
  SetTarget: boolean
}