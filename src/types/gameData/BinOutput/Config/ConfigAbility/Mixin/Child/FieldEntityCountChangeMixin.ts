import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'
import ConfigAbilityPredicate from '../../Predicate'

export default interface FieldEntityCountChangeMixin extends ConfigBaseAbilityMixin {
  $type: 'FieldEntityCountChangeMixin'
  CampTargetType: string
  ForceTriggerWhenChangeAuthority: boolean
  TargetPredicates: ConfigAbilityPredicate[]
  OnFieldEnter: ConfigAbilityAction[]
  OnFieldExit: ConfigAbilityAction[]
}