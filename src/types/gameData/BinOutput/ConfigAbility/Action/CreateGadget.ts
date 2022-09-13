import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface CreateGadget extends Action {
  GadgetID: number
  CampID: number
  Born?: BornConfig
  CampTargetType?: string
  ByServer?: boolean
}