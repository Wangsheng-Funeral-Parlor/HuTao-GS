import ConfigBaseMove from '.'
import ConfigMoveSmoothedSpeed from '../../ConfigMoveSmoothedSpeed'

export default interface ConfigAnimatorMove extends ConfigBaseMove {
  $type: 'ConfigAnimatorMove'
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