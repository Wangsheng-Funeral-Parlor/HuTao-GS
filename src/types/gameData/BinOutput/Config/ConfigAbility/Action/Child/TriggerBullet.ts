import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface TriggerBullet extends ConfigBaseAbilityAction {
  $type: 'TriggerBullet'
  BulletID: number
  Born: ConfigBornType
  OwnerIs?: string
  PropOwnerIs?: string
  LifeByOwnerIsAlive?: boolean
  TrackTarget?: string
  SightGroupWithOwner?: boolean
}