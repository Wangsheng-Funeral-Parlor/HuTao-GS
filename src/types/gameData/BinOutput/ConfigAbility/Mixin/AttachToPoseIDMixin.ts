import { AttachMixin } from '.'

export default interface AttachToPoseIDMixin extends AttachMixin {
  PoseIDs: number[]
  ModifierName: string
}