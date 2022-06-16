import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface FixedMonsterRushMove extends Action {
  ToPos: BornConfig
  TimeRange: number
  MaxRange?: number
  AnimatorStateIDs: string[]
  OverrideMoveCollider: string
}