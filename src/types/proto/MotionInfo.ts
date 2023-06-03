import { MotionStateEnum } from "./enum"

import { VectorInfo } from "."

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
