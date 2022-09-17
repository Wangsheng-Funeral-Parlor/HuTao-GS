import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityPredicate from '.'

export default interface BySceneSurfaceType extends ConfigBaseAbilityPredicate {
  $type: 'BySceneSurfaceType'
  Filters: string[]
  Include: boolean
  Offset: DynamicVector
}