import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseScenePoint from '.'

export default interface DungeonSlipRevivePoint extends ConfigBaseScenePoint {
  $type: 'DungeonSlipRevivePoint'
  Size: DynamicVector
  IsActive: boolean
  GroupIds: number[]
}