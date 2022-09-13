import { Action } from '.'
import BornConfig from '../../Common/Born'

export default interface TriggerBullet extends Action {
  BulletID: number
  Born: BornConfig
  OwnerIs?: string
  PropOwnerIs?: string
  LifeByOwnerIsAlive?: boolean
  TrackTarget?: string
  SightGroupWithOwner?: boolean
}