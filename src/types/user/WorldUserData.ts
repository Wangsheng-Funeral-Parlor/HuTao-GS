import { VectorInterface } from '../game/motion'

export interface LastStateUserData {
  sceneId: number
  pos: VectorInterface
  rot: VectorInterface
}

export default interface WorldUserData {
  id: number
  lastStateData: LastStateUserData
}