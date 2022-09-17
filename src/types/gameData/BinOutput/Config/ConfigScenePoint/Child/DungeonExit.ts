import ConfigBaseScenePoint from '.'

export default interface DungeonExit extends ConfigBaseScenePoint {
  $type: 'DungeonExit'
  EntryPointId: number
}