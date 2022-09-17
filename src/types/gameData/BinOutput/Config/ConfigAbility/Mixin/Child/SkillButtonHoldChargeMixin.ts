import ConfigBaseAbilityMixin from '.'

export default interface SkillButtonHoldChargeMixin extends ConfigBaseAbilityMixin {
  $type: 'SkillButtonHoldChargeMixin'
  AllowHoldLockDirection: boolean
  SkillID: number
  NextLoopTriggerID: string
  EndHoldTrigger: string
  BeforeStateIDs: string[]
  BeforeHoldDuration: number
  ChargeLoopStateIDs: string[]
  AfterStateIDs: string[]
  ChargeLoopDurations: number[]
  TransientStateIDs: string[]
}