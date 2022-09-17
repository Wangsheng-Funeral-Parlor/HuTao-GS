export default interface ConfigAIBrownianMotionData {
  SpeedLevel: number
  TurnSpeedOverride: number
  MoveCdMin: number
  MoveCdMax: number
  TerrainOffsetMin: number
  TerrainOffsetMax: number
  MotionRadius: number
  RecalcCenterOnLeaveCurrentZone: boolean
  RecalcCenterOnAttachPosChange: boolean
}