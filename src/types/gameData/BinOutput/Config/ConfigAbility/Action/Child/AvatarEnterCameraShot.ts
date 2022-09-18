import ConfigBaseAbilityAction from '.'

export default interface AvatarEnterCameraShot extends ConfigBaseAbilityAction {
  $type: 'AvatarEnterCameraShot'
  CameraMoveCfgPath: string
  ShotType: string
}