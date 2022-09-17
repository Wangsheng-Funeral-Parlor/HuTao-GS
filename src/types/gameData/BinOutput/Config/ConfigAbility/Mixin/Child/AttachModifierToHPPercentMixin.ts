import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface AttachModifierToHPPercentMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToHPPercentMixin'
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
}