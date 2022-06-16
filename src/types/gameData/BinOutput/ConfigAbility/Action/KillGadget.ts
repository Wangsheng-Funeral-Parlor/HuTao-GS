import { Action } from '.'

export default interface KillGadget extends Action {
  GadgetInfo: {
    SortType: string
    ConfigID: number
  }
}