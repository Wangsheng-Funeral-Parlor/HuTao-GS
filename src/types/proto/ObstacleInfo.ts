import { MathQuaternionInfo, VectorInfo } from '.'
import { ShapeTypeEnum } from './enum'

export interface ObstacleInfo {
  obstacleId: number
  shape: ShapeTypeEnum
  center: VectorInfo
  rotation: MathQuaternionInfo
  extents: VectorInfo
}