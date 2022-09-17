import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigCameraShake from '$DT/BinOutput/Config/ConfigCameraShake'
import ConfigBaseAbilityAction from '.'

export default interface ActCameraShake extends ConfigBaseAbilityAction {
  $type: 'ActCameraShake'
  CameraShake: ConfigCameraShake
  Born: ConfigBornType
}