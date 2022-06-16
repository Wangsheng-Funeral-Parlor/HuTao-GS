import { VectorInterface } from "./motion"

export interface PlayerLocationInfo {
  uid: number
  pos: VectorInterface
  rot: VectorInterface
}

export interface PlayerRTTInfo {
  uid: number
  rtt: number
}

export interface PlayerWorldLocationInfo {
  sceneId: number
  playerLoc: PlayerLocationInfo
}