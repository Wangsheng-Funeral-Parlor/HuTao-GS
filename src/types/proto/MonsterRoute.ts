import { RoutePoint } from "."

export interface MonsterRoute {
  routePoints: RoutePoint[]
  speedLevel: number
  routeType: number
  arriveRange: number
}
