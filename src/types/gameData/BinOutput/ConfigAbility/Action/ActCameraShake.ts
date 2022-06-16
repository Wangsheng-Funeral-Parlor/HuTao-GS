import { Action } from '.'
import BornConfig from '../../Common/Born'
import CameraShakeConfig from '../../Common/CameraShake'

export default interface ActCameraShake extends Action {
  CameraShake: CameraShakeConfig
  Born: BornConfig
}