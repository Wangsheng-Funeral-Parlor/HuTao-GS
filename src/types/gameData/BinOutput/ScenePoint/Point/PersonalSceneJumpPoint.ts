import Vector from '../../Common/Vector'
import { Point } from '.'

export default interface PersonalSceneJumpPoint extends Point {
  TranSceneId: number
  TitleTextID: string
  TriggerSize: Vector
  CloseTime: number
}