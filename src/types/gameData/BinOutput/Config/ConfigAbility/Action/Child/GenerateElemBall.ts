import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface GenerateElemBall extends ConfigBaseAbilityAction {
  $type: 'GenerateElemBall'
  DropType: string
  ConfigID: number
  Born: ConfigBornType
  Ratio: DynamicFloat
  BaseEnergy: number
}