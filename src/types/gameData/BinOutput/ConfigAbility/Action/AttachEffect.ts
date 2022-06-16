import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface AttachEffect extends Action {
  EffectPattern: string
  Born?: BornConfig
}