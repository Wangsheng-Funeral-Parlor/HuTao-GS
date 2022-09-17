import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface WindZoneMixin extends ConfigBaseAbilityMixin {
  $type: 'WindZoneMixin'
  ShapeName: string
  Born: ConfigBornType
  Strength: DynamicFloat
  Attenuation: DynamicFloat
  InnerRadius: DynamicFloat
  Reverse: boolean
  TargetType: string
  Predicates: ConfigAbilityPredicate[]
  ModifierName: string
  MaxNum: number
  ForceGrowth: number
  ForceFallen: number
}