import ConfigStateCameraParam from '$DT/BinOutput/Config/ConfigStateCameraParam'
import ConfigBaseAbilityAction from '.'

export default interface AvatarCameraParam extends ConfigBaseAbilityAction {
  $type: 'AvatarCameraParam'
  CameraParam: ConfigStateCameraParam
}