import { MovingPlatformTypeEnum } from "./enum"

import { MathQuaternionInfo, Route, VectorInfo } from "."

export interface PlatformInfo {
  routeId: number
  startIndex: number
  startRouteTime: number
  startSceneTime: number
  startPos: VectorInfo
  isStarted: boolean
  startRot: MathQuaternionInfo
  stopSceneTime: number
  posOffset: VectorInfo
  rotOffset: MathQuaternionInfo
  movingPlatformType: MovingPlatformTypeEnum
  isActive: boolean
  route: Route
  pointId: number
}
