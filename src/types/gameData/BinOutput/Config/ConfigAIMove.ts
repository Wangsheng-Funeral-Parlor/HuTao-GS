import ConfigAISnakelikeMove from './ConfigAISnakelikeMove'

export default interface ConfigAIMove {
  Enable: boolean
  MoveCategory: string
  UseNavMesh: boolean
  NavMeshAgentName: string
  AlmostReachedDistanceWalk: number
  AlmostReachedDistanceRun: number
  SnakelikeMoveSetting: ConfigAISnakelikeMove
}