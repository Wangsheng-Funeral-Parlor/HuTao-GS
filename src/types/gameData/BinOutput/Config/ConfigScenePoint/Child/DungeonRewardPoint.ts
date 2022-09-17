import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseScenePoint from '.'

export default interface DungeonRewardPoint extends ConfigBaseScenePoint {
  $type: 'DungeonRewardPoint'
  IsActive: boolean
  DropPointList: DynamicVector[]
}