import ConfigBaseAbilityMixin from '.'

export default interface RejectAttackMixin extends ConfigBaseAbilityMixin {
  $type: 'RejectAttackMixin'
  AttackTag: string
  LimitTime: number
  Type: string
}