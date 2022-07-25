import { MotionInfo } from '.'

export interface EntityMoveInfo {
  entityId: number
  motionInfo: MotionInfo
  sceneTime: number
  reliableSeq: number
  isReliable: boolean
}