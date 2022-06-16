import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface CreateGadget extends Action {
  Target: string
  Born: BornConfig
  GadgetID: number
  CampID: number
}