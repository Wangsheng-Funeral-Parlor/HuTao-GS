import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface ShieldBarMixin extends ConfigBaseAbilityMixin {
  $type: 'ShieldBarMixin'
  OnShieldBroken: ConfigAbilityAction[]
  Revert: boolean
  ShowDamageText: string
  UseMutiPlayerFixData: boolean
}