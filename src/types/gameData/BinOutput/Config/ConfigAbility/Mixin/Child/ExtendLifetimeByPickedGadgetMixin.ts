import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface ExtendLifetimeByPickedGadgetMixin extends ConfigBaseAbilityMixin {
  $type: 'ExtendLifetimeByPickedGadgetMixin'
  PickedConfigIDs: number[]
  ExtendLifeTime: DynamicFloat
  MaxExtendLifeTime: DynamicFloat
}