import { MathQuaternionInfo, VectorInfo } from "."

export interface RoutePoint {
  velocity: number
  time: number

  rotation: VectorInfo
  rotationSpeed: MathQuaternionInfo
  axisSpeed: MathQuaternionInfo

  position: VectorInfo
  arriveRange: number
}
