import { MathQuaternionInterface, VectorInterface } from './motion'

export interface RoutePoint {
  velocity: number
  time: number

  rotation: VectorInterface
  rotationSpeed: MathQuaternionInterface
  axisSpeed: MathQuaternionInterface

  position: VectorInterface
  arriveRange: number
}

export interface Route {
  routePoints: RoutePoint[]
  routeType: number
}

export interface MonsterRoute {
  routePoints: RoutePoint[]
  speedLevel: number
  routeType: number
  arriveRange: number
}