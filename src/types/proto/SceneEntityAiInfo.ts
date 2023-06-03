import { ServantInfo, VectorInfo } from "."

export interface SceneEntityAiInfo {
  isAiOpen?: boolean
  bornPos?: VectorInfo
  skillCdMap?: { [id: number]: number }
  servantInfo?: ServantInfo
  aiThreatMap?: { [id: number]: number }
  skillGroupCdMap?: { [id: number]: number }
  curTactic?: number
}
