export default interface ConfigAIFleeData {
  SpeedLevel: number
  TurnSpeedOverride: number
  Cd: number
  TriggerDistance: number
  FleeAngle: number
  FleeNumberMin: number
  FleeNumberMax: number
  FleeDistanceMin: number
  FleeDistanceMax: number
  TurnToTarget: boolean
  RestrictedByDefendArea: boolean
  ExpandFleeAngleWhenBlocked: boolean
  KillSelfTime: number
}
