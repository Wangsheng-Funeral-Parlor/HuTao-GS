import Vector from '../../Common/Vector'
import DungeonEntry from './DungeonEntry'
import DungeonExit from './DungeonExit'
import PersonalSceneJumpPoint from './PersonalSceneJumpPoint'
import SceneBuildingPoint from './SceneBuildingPoint'
import SceneTransPoint from './SceneTransPoint'
import SceneVehicleSummonPoint from './SceneVehicleSummonPoint'
import VirtualTransPoint from './VirtualTransPoint'

export interface Point {
  $type: string
  GadgetId: number
  AreaId?: number
  Pos: Vector
  Rot?: Vector
  Alias: string
  TranPos?: Vector
  TranRot?: Vector
  Unlocked?: boolean
}

type PointConfig =
  DungeonEntry |
  DungeonExit |
  PersonalSceneJumpPoint |
  SceneBuildingPoint |
  SceneTransPoint |
  SceneVehicleSummonPoint |
  VirtualTransPoint

export default PointConfig