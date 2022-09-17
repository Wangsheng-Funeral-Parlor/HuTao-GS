import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DoActionByKillingMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByKillingMixin'
  AttackTags: string[]
  DetectWindow: number
  OnKill: ConfigAbilityAction[]
}