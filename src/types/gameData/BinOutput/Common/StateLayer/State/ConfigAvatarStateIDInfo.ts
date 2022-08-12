import { State } from '.'

export default interface ConfigAvatarStateIDInfo extends State {
  MoveType?: string
  CanDoSkill?: boolean
  AddEndure?: number
  MassRatio?: number
  ResetAnimatorTriggerOnEnter?: string[]
  ResetAnimatorTriggerOnExit?: string[]
  SetAnimatorBoolean?: {
    Name: string
    NormalizeStart?: number
  }[]
  CameraType?: string
  CanChangeAvatar?: {
    NormalizeStart?: number
  }[]
  JumpCancelStart?: number
  JumpCancelEnd?: number
  SprintCancelStart?: number
  SprintCancelEnd?: number
  ActionPanelState?: string
  EnableRagDoll?: boolean
  AnimatorTriggerOnLanded: string
  BattouOnStart?: boolean
  SheatheOnStart?: boolean
}