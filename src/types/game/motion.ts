import { MotionStateEnum } from '../enum/entity'

export interface VectorInterface {
  X?: number
  Y?: number
  Z?: number
}

export interface MathQuaternionInterface {
  X?: number
  Y?: number
  Z?: number
  W?: number
}

export interface MotionInfoInterface {
  pos: VectorInterface
  rot: VectorInterface
  speed: VectorInterface
  state: MotionStateEnum
  params?: VectorInterface[]
  refPos?: VectorInterface
  refId?: number
  sceneTime?: number
  intervalVelocity?: number
}