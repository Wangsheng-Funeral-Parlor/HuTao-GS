import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface ResetEnviroEular extends ConfigBaseAbilityAction {
  $type: 'ResetEnviroEular'
  EularAngles: DynamicVector
}