import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface SetGlobalDir extends ConfigBaseAbilityAction {
  $type: 'SetGlobalDir'
  Key: string
  Born: ConfigBornType
  SetTarget: boolean
}