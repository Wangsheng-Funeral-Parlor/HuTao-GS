import ConfigForceField from './Child/ConfigForceField'
import ConfigLoadingDoor from './Child/ConfigLoadingDoor'
import ConfigLocalEntity from './Child/ConfigLocalEntity'
import DungeonEntry from './Child/DungeonEntry'
import DungeonExit from './Child/DungeonExit'
import DungeonQuitPoint from './Child/DungeonQuitPoint'
import DungeonRewardPoint from './Child/DungeonRewardPoint'
import DungeonSlipRevivePoint from './Child/DungeonSlipRevivePoint'
import DungeonWayPoint from './Child/DungeonWayPoint'
import PersonalSceneJumpPoint from './Child/PersonalSceneJumpPoint'
import SceneBuildingPoint from './Child/SceneBuildingPoint'
import SceneTransPoint from './Child/SceneTransPoint'
import SceneVehicleSummonPoint from './Child/SceneVehicleSummonPoint'
import VirtualTransPoint from './Child/VirtualTransPoint'

type ConfigScenePoint =
  ConfigForceField |
  ConfigLoadingDoor |
  ConfigLocalEntity |
  DungeonEntry |
  DungeonExit |
  DungeonQuitPoint |
  DungeonRewardPoint |
  DungeonSlipRevivePoint |
  DungeonWayPoint |
  PersonalSceneJumpPoint |
  SceneBuildingPoint |
  SceneTransPoint |
  SceneVehicleSummonPoint |
  VirtualTransPoint

export default ConfigScenePoint