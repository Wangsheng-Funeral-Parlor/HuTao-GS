import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigWaypoint {
  Pos: DynamicVector
  WaitTime: number
  MoveAngularSpeed: number
  WaitAngularSpeed: number
  MoveRotateRound: number
  WaitRotateRound: number
  StopWaitRotate: boolean
  SpeedLevel: number
  TargetVelocity: number
  HasReachEvent: boolean
  RotAngleMoveSpeed: number
  RotAngleWaitSpeed: number
  RotAngleSameStop: boolean
  RotRoundReachDir: DynamicVector
  RotRoundReachRounds: number
  RotRoundLeaveDir: DynamicVector
  RotRoundWaitRounds: number
  ReachStop: boolean
}
