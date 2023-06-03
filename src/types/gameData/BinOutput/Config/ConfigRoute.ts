import ConfigWaypoint from "./ConfigWaypoint"

export default interface ConfigRoute {
  LocalId: number
  Name: string
  Type: string
  IsForward: boolean
  Points: ConfigWaypoint[]
  RotType: string
  RotAngleType: string
  ArriveRange: number
}
