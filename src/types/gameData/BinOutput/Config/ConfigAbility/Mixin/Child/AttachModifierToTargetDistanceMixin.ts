import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface AttachModifierToTargetDistanceMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachModifierToTargetDistanceMixin'
  TargetIDs: number[]
  Byserver: boolean
  ValueSteps: DynamicFloat[]
  ModifierNameSteps: string[]
  RemoveAppliedModifier: boolean
  BlendParam: string
  BlendDistance: DynamicFloat[]
  EffectPattern: string
}