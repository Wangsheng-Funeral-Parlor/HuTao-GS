import { DynamicFloat, DynamicInt } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface EntityDefenceMixin extends ConfigBaseAbilityMixin {
  $type: 'EntityDefenceMixin'
  StateIDs: string[]
  DefendTriggerID: string
  DefendAngle: number
  DefendProbability: DynamicFloat
  DefendProbabilityDelta: DynamicFloat
  DefendTimeInterval: DynamicFloat
  AlwaysRecover: boolean
  DefendCountInterval: DynamicInt
}