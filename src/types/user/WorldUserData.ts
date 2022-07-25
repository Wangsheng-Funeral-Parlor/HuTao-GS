import { VectorInfo } from '../proto'
import SceneUserData from './SceneUserData'

export interface LastStateUserData {
  sceneId: number
  pos: VectorInfo
  rot: VectorInfo
}

export default interface WorldUserData {
  id: number
  sceneDataMap: { [sceneId: number]: SceneUserData }
  lastStateData: LastStateUserData
}