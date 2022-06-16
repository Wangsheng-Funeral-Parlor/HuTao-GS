import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface TriggerBullet extends Action {
  BulletID: number
  Born: BornConfig
  LifeByOwnerIsAlive?: boolean
  TrackTarget?: string
}