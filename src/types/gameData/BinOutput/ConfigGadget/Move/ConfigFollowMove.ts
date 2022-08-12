import { Move } from '.'
import Vector from '../../Common/Vector'

export interface ConfigFollowMove extends Move {
  AttachPoint: string
  FollowRotation: boolean
  Forward: Vector
  FollowOwnerInvisible: boolean
}