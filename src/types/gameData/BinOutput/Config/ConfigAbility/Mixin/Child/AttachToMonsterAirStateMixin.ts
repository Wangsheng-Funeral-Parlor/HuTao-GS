import ConfigBaseAbilityMixin from '.'

export default interface AttachToMonsterAirStateMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToMonsterAirStateMixin'
  ModifierName: string
  IsAirMove: boolean
}