import { AttackResult } from "."

export interface EvtBeingHitInfo {
  peerId: number
  attackResult: AttackResult
  frameNum: number
}
