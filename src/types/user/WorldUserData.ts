import { VectorInterface } from '../game/motion'
import SceneUserData from './SceneUserData'

export interface LastStateUserData {
  sceneId: number
  pos: VectorInterface
  rot: VectorInterface
}

export default interface WorldUserData {
  id: number
  sceneDataMap: { [sceneId: number]: SceneUserData }
  lastStateData: LastStateUserData
}