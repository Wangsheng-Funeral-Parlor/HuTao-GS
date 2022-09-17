import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseScenePoint from '.'

export default interface DungeonWayPoint extends ConfigBaseScenePoint {
  $type: 'DungeonWayPoint'
  Size: DynamicVector
  IsBoss: boolean
  IsActive: boolean
  GroupIds: number[]
}