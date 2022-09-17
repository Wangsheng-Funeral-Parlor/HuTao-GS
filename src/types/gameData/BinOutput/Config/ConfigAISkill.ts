import ConfigAIBuddySkillCondition from './ConfigAIBuddySkillCondition'
import ConfigAISkillCastCondition from './ConfigAISkillCastCondition'

export default interface ConfigAISkill {
  Name: string
  SkillType: string
  CombatSkillType: string
  Priority: number
  NeedLineOfSight: boolean
  FaceTarget: boolean
  CanUseIfTargetInactive: boolean
  EnableSkillPrepare: boolean
  SkillPrepareTimeout: number
  SkillPrepareSpeedLevel: number
  CastCondition: ConfigAISkillCastCondition
  Cd: number
  CdUpperRange: number
  InitialCD: number
  InitialCDUpperRange: number
  PublicCDGroup: string
  IgnoreGCD: boolean
  TriggerGCD: boolean
  TriggerCDOnStart: boolean
  SkillGroupCDID: number
  StateIDs: string[]
  SkillQueryingTime: number
  CommandID: number
  FlagTargetReachable: string
  FlagSelfOnTemplateCollider: string
  FlagSelfInZone: string
  FlagTargetInZone: string
  BuddySkillCondition: ConfigAIBuddySkillCondition
  NerveTrigger: string[]
}