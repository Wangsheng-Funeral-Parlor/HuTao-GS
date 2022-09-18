import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface TriggerBullet extends ConfigBaseAbilityAction {
  $type: 'TriggerBullet'
  BulletID: number
  Born: ConfigBornType
  OwnerIsTarget: boolean
  OwnerIs: string
  PropOwnerIs: string
  LifeByOwnerIsAlive: boolean
  TrackTarget: string
  SightGroupWithOwner: boolean
}