import { VectorInfo } from ".."

export interface OneoffGatherPointDetectorData {
  materialId: number
  isAllCollected?: boolean
  isHintValid?: boolean
  hintCenterPos: VectorInfo
  hintRadius: number
  groupId: number
  configId: number
}
