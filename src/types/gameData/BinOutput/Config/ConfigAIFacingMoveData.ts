import ConfigAIFacingMoveWeight from "./ConfigAIFacingMoveWeight"

export default interface ConfigAIFacingMoveData {
  SpeedLevel: number
  RangeMin: number
  RangeMax: number
  RestTimeMin: number
  RestTimeMax: number
  FacingMoveTurnInterval: number
  FacingMoveMinAvoidanceVelecity: number
  ObstacleDetectRange: number
  FacingMoveWeight: ConfigAIFacingMoveWeight
}
