import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DoActionByGainCrystalSeedMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByGainCrystalSeedMixin'
  ElementTypes: string[]
  Actions: ConfigAbilityAction[]
}