import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface AttachModifierToElementDurabilityMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToElementDurabilityMixin'
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
}