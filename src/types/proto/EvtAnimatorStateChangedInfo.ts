import { VectorInfo } from "."

export interface EvtAnimatorStateChangedInfo {
  entityId: number
  toStateHash: number
  normalizedTimeCompact: number
  faceAngleCompact: number
  pos: VectorInfo
  fadeDuration: number
}
