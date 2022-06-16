import { ShapeTypeEnum } from '../enum/obstacle'
import { MathQuaternionInterface, VectorInterface } from './motion'

export interface ObstacleInfo {
  obstacleId: number
  shape: ShapeTypeEnum
  center: VectorInterface
  rotation: MathQuaternionInterface
  extents: VectorInterface
}