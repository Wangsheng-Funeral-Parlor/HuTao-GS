import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface BeingHitMixin extends ConfigBaseAbilityMixin {
  $type: 'BeingHitMixin'
  ToAttacker: ConfigAbilityAction[]
  ToAttackerOwner: ConfigAbilityAction[]
  ToAttackerOriginOwner: ConfigAbilityAction[]
}