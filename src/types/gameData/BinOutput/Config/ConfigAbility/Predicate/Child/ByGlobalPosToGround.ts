import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByGlobalPosToGround extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByGlobalPosToGround'
  GlobalPos: string
  ToGroundHeight: DynamicFloat
  ToWater: boolean
}