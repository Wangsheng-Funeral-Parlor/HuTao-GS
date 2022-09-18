import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import FocusAssistanceGroup from '$DT/BinOutput/Config/FocusAssistanceGroup'
import ConfigBaseAbilityAction from '.'

export default interface AvatarEnterFocus extends ConfigBaseAbilityAction {
  $type: 'AvatarEnterFocus'
  CameraFollowLower: DynamicVector
  CameraFollowUpper: DynamicVector
  CameraFollowMaxDegree: number
  CameraFollowMinDegree: number
  CameraFastFocusMode: boolean
  FaceToTarget: boolean
  FaceToTargetAngleThreshold: number
  ChangeMainSkillID: boolean
  DragButtonName: string
  Assistance: FocusAssistanceGroup
  CanMove: boolean
  ShowCrosshair: boolean
  FocusAnchorHorAngle: number
  FocusAnchorVerAngle: number
  DisableAnim: boolean
}