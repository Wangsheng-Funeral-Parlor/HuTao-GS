import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface ForceInitMassiveEntity extends ConfigBaseAbilityAction {
  $type: 'ForceInitMassiveEntity'
  Born: ConfigBornType
  Radius: number
  Angle: number
  Height: number
}