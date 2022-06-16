import { AttachMixin } from '.'

export default interface AttachToStateIDMixin extends AttachMixin {
  StateIDs: string[]
  ModifierName: string
}