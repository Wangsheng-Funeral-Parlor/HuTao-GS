import { ShapeTypeEnum } from "./enum"

import { MathQuaternionInfo, VectorInfo } from "."

export interface ObstacleInfo {
  obstacleId: number
  shape: ShapeTypeEnum
  center: VectorInfo
  rotation: MathQuaternionInfo
  extents: VectorInfo
}
