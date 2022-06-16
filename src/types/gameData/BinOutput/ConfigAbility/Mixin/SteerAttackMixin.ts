import { Mixin } from '.'

export default interface SteerAttackMixin extends Mixin {
  SteerStateIDs: string[]
  StartNormalizedTime?: number
  EndNormalizedTime?: number
  AngularSpeed: number
  AttackTrigger: string
  AttackDistance?: number
}