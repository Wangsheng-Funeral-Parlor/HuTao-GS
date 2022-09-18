import ConfigCameraRadialBlur from '$DT/BinOutput/Config/ConfigCameraRadialBlur'
import ConfigBaseAbilityAction from '.'

export default interface ActCameraRadialBlur extends ConfigBaseAbilityAction {
  $type: 'ActCameraRadialBlur'
  CameraRadialBlur: ConfigCameraRadialBlur
}