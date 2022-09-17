import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseMove from '.'
import ConfigIgnoreCollision from '../../ConfigIgnoreCollision'
import ConfigMoveDisableCollision from '../../ConfigMoveDisableCollision'

export default interface ConfigFollowMove extends ConfigBaseMove {
  $type: 'ConfigFollowMove'
  Target: string
  GroupTargetInstanceId: number
  AttachPoint: string
  FollowRotation: boolean
  Offset: DynamicVector
  Forward: DynamicVector
  FollowOwnerInvisible: boolean
  FixedY: number
  IgnoreCollision: ConfigIgnoreCollision
  MoveDisableCollision: ConfigMoveDisableCollision
}