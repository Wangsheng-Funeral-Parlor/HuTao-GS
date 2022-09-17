import ConfigBaseStateIDInfo from '.'
import ConfigAnimatorBoolean from '../../ConfigAnimatorBoolean'

export default interface ConfigNormalStateIDInfo extends ConfigBaseStateIDInfo {
  AnimatorStates: { [key: string]: string[] }
  MoveType: string
  CombatMoveOnWater: boolean
  CanDoSkill: boolean
  CanDoSkillStart: number
  CanDoSkillEnd: number
  CanSyncMove: boolean
  CullingModelAlwaysAnimate: boolean
  AddEndure: number
  MassRatio: number
  ResetAnimatorTriggerOnEnter: string[]
  ResetAnimatorTriggerOnExit: string[]
  SetAnimatorBoolean: ConfigAnimatorBoolean[]
  EnableRagDoll: boolean
  NeedFaceToAnimParam: boolean
  EnableCCD: boolean
}