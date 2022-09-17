import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface AttachModifierToSelfGlobalValueMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToSelfGlobalValueMixin'
  GlobalValueTarget: string
  GlobalValueKey: string
  AddAction: string
  DefaultGlobalValueOnCreate: DynamicFloat
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
  ActionQueues: ConfigAbilityAction[][]
  RemoveAppliedModifier: boolean
}