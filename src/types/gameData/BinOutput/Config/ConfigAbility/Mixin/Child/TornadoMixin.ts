import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigTornadoZone from '$DT/BinOutput/Config/ConfigTornadoZone'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityPredicate from '../../Predicate'

export default interface TornadoMixin extends ConfigBaseAbilityMixin {
  $type: 'TornadoMixin'
  StageZone: ConfigTornadoZone[]
  Predicates: ConfigAbilityPredicate[]
  TargetType: string
  Born: ConfigBornType
  EnviroWindStrength: DynamicFloat
  EnviroWindRadius: DynamicFloat
}