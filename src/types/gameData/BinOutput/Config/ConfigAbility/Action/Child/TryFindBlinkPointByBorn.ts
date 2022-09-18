import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface TryFindBlinkPointByBorn extends ConfigBaseAbilityAction {
  $type: 'TryFindBlinkPointByBorn'
  Born: ConfigBornType
  HitSceneTest: boolean
  HitSceneType: string
  LimitY: DynamicFloat
}