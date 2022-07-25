import { VectorInfo } from '.'
import { MotionStateEnum } from './enum'

export interface MotionInfo {
  pos: VectorInfo
  rot: VectorInfo
  speed: VectorInfo
  state: MotionStateEnum
  params?: VectorInfo[]
  refPos?: VectorInfo
  refId?: number
  sceneTime?: number
  intervalVelocity?: number
}