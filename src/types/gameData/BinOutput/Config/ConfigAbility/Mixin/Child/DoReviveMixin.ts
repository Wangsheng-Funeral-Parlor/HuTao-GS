import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DoReviveMixin extends ConfigBaseAbilityMixin {
  $type: 'DoReviveMixin'
  Type: string
  IgnoreDieAbyss: boolean
  IgnoreDieDrawn: boolean
  OnKillActions: ConfigAbilityAction[]
  OnReviveActions: ConfigAbilityAction[]
}