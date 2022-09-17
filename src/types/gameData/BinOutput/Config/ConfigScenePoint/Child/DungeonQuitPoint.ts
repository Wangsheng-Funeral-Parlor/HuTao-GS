import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseScenePoint from '.'

export default interface DungeonQuitPoint extends ConfigBaseScenePoint {
  $type: 'DungeonQuitPoint'
  Size: DynamicVector
}