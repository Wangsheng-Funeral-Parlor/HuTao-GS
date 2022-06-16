import { DoActionMixin } from '.'

export interface DoActionByStateIDMixin extends DoActionMixin {
  StateIDs: string[]
}