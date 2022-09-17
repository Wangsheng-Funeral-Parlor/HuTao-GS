import ConfigBaseAbilityMixin from '.'

export default interface SteerAttackMixin extends ConfigBaseAbilityMixin {
  $type: 'SteerAttackMixin'
  SteerStateIDs: string[]
  StartNormalizedTime?: number
  EndNormalizedTime?: number
  AngularSpeed: number
  AttackAngle?: number
  AttackTrigger: string
  AttackDistance?: number
}