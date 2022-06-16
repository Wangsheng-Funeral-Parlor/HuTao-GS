import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface FireEffect extends Action {
  EffectPattern: string
  Born: BornConfig
}