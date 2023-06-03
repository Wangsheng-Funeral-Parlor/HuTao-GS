import { OnlinePlayerInfo } from "."

export interface ScenePlayerInfo {
  uid: number
  peerId: number
  name: string
  isConnected?: boolean
  sceneId: number
  onlinePlayerInfo: OnlinePlayerInfo
}
