import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface PushPos extends ConfigBaseAbilityAction {
  $type: 'PushPos'
  PosType: ConfigBornType
  SaveTo: string
}