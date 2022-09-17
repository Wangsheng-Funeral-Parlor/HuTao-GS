import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import TileShapeInfo from '$DT/BinOutput/Config/TileShapeInfo'
import ConfigBaseAbilityMixin from '.'

export default interface TileComplexMixin extends ConfigBaseAbilityMixin {
  $type: 'TileComplexMixin'
  AttackID: string
  AttachPointName: string
  Offset: DynamicVector
  Shape: TileShapeInfo
}