import ConfigBaseAbilityAction from ".."

import CheckGround from "$DT/BinOutput/Config/CheckGround"
import ConfigBornType from "$DT/BinOutput/Config/ConfigBornType"

export default interface BaseCreateEntity extends ConfigBaseAbilityAction {
  OwnerIsTarget: boolean
  OwnerIs: string
  PropOwnerIs: string
  LifeByOwnerIsAlive: boolean
  Born: ConfigBornType
  CheckGround: CheckGround
  SightGroupWithOwner: boolean
}

export interface CreateGadget extends BaseCreateEntity {
  $type: "CreateGadget"
  GadgetID: number
  CampID: number
  CampTargetType: string
  ByServer: boolean
}

export interface CreateItem extends BaseCreateEntity {
  $type: "CreateItem"
}
