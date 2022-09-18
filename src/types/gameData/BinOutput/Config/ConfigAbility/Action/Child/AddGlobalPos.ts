import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface AddGlobalPos extends ConfigBaseAbilityAction {
  $type: 'AddGlobalPos'
  Key: string
  Born: ConfigBornType
  SetTarget: boolean
}