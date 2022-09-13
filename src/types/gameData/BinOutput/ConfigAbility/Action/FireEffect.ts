import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface FireEffect extends Action {
  EffectPattern: string
  OthereffectPatterns?: string[]
  Born: BornConfig
  OwnedByLevel?: boolean
  UseY?: boolean
  Scale?: number
  EffectTempleteID?: number
}