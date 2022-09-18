import CheckGround from '$DT/BinOutput/Config/CheckGround'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '../..'

export default interface BaseCreateEntity extends ConfigBaseAbilityAction {
  OwnerIsTarget: boolean
  OwnerIs: string
  PropOwnerIs: string
  LifeByOwnerIsAlive: boolean
  Born: ConfigBornType
  CheckGround: CheckGround
  SightGroupWithOwner: boolean
}