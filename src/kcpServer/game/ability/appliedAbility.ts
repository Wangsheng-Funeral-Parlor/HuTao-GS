import AbilityScalarValueContainer from "./abilityScalarValueContainer"

import AbilityManager from "$/manager/abilityManager"
import { AbilityAppliedAbility, AbilityScalarValueEntry, AbilityString } from "@/types/proto"
import { ProtEntityTypeEnum } from "@/types/proto/enum"

export default class AppliedAbility {
  manager: AbilityManager
  id: number

  abilityName: AbilityString
  abilityOverride: AbilityString

  overrideMapContainer: AbilityScalarValueContainer

  constructor(manager: AbilityManager, id: number) {
    this.manager = manager
    this.id = id

    this.abilityName = null
    this.abilityOverride = null

    this.overrideMapContainer = new AbilityScalarValueContainer()
  }

  setAbilityName(abilityName: AbilityString) {
    if (abilityName == null) return
    this.abilityName = abilityName
  }

  setAbilityOverride(abilityOverride: AbilityString) {
    if (abilityOverride == null) return
    this.abilityOverride = abilityOverride
  }

  setOverrideMap(overrideMap: AbilityScalarValueEntry[] = []) {
    this.overrideMapContainer.setValues(overrideMap)
  }

  setOverrideParam(sval: AbilityScalarValueEntry) {
    this.overrideMapContainer.setValue(sval)
  }

  getEntityInfo(): { type: string; name: string } {
    const { manager } = this
    const { entity } = manager
    const { protEntityType, name } = entity
    const type = ProtEntityTypeEnum[protEntityType]?.split("_")?.slice(-1)?.[0]
    if (type == null) return null

    return {
      type: type[0] + type.slice(1).toLowerCase(),
      name,
    }
  }

  export(): AbilityAppliedAbility {
    const { id, abilityName, abilityOverride, overrideMapContainer } = this
    return {
      instancedAbilityId: id,
      abilityName,
      abilityOverride,
      overrideMap: overrideMapContainer.export(),
    }
  }
}
