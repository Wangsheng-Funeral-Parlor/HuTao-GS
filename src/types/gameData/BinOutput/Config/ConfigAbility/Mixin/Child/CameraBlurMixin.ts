import ConfigCameraRadialBlur from '$DT/BinOutput/Config/ConfigCameraRadialBlur'
import ConfigBaseAbilityMixin from '.'

export default interface CameraBlurMixin extends ConfigBaseAbilityMixin {
  $type: 'CameraBlurMixin'
  CameraRadialBlur: ConfigCameraRadialBlur
}