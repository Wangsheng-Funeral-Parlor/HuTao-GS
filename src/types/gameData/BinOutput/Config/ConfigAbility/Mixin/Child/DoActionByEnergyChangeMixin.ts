import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DoActionByEnergyChangeMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByEnergyChangeMixin'
  Type: string
  ElementTypes: string[]
  DoWhenEnergyMax: boolean
  OnGainEnergyByBall: ConfigAbilityAction[]
  OnGainEnergyByOther: ConfigAbilityAction[]
  OnGainEnergyByAll: ConfigAbilityAction[]
  OnGainEnergyMax: ConfigAbilityAction[]
}