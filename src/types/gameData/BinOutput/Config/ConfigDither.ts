import ConfigDitherByBetweenCameraAndAvatar from './ConfigDitherByBetweenCameraAndAvatar'
import ConfigDitherByNormalBetweenCamera from './ConfigDitherByNormalBetweenCamera'
import ConfigDitherByStartDitherAction from './ConfigDitherByStartDitherAction'

export default interface ConfigDither {
  ShowDitherDuration: number
  StartDitherAction: ConfigDitherByStartDitherAction
  BetweenCameraAndAvatar: ConfigDitherByBetweenCameraAndAvatar
  NormalBetweenCamera: ConfigDitherByNormalBetweenCamera
}