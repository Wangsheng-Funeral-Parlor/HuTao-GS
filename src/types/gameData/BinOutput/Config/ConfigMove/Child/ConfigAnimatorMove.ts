import ConfigMoveSmoothedSpeed from "../../ConfigMoveSmoothedSpeed"

import ConfigBaseMove from "."

export default interface ConfigAnimatorMove extends ConfigBaseMove {
  $type: "ConfigAnimatorMove"
  InitWithGroundHitCheck: boolean
  SmoothedSpeed: ConfigMoveSmoothedSpeed
  MoveOnGround: boolean
  MoveOnWater: boolean
  MoveOnWaterDepth: number
  FacingMove: string
  MonsterSizeType: string
  PositionModifyState: string
  PositionModifyStateMap: { [id: number]: string }
}
