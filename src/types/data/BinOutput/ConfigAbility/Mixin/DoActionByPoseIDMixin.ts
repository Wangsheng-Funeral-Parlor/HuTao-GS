import { DoActionMixin } from '.'

export default interface DoActionByPoseIDMixin extends DoActionMixin {
  PoseIDs: number[]
}