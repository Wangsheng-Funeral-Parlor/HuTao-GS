import AbilityManager from '$/manager/abilityManager'
import { AbilityAppliedAbility, AbilityScalarValueEntry, AbilityString } from '@/types/proto'
import { ProtEntityTypeEnum } from '@/types/proto/enum'
import AbilityScalarValueContainer from './abilityScalarValueContainer'

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

  private async loadAbilityData() {
    return
  }

  async setAbilityName(abilityName: AbilityString = null) {
    const { manager } = this
    const { stringManager } = manager
    if (stringManager.compare(abilityName, this.abilityName)) return

    this.abilityName = stringManager.getByAbilityString(abilityName)
    await this.loadAbilityData()
  }

  async setAbilityOverride(abilityOverride: AbilityString = null) {
    const { manager } = this
    const { stringManager } = manager
    if (stringManager.compare(abilityOverride, this.abilityOverride)) return

    this.abilityOverride = stringManager.getByAbilityString(abilityOverride)
    await this.loadAbilityData()
  }

  setOverrideMap(overrideMap: AbilityScalarValueEntry[] = []) {
    this.overrideMapContainer.setValues(overrideMap)
  }

  getEntityInfo(): { type: string, name: string } {
    const { manager } = this
    const { entity } = manager
    const { protEntityType, name } = entity
    const type = ProtEntityTypeEnum[protEntityType]?.split('_')?.slice(-1)?.[0]
    if (type == null) return null

    return {
      type: type[0] + type.slice(1).toLowerCase(),
      name
    }
  }

  export(): AbilityAppliedAbility {
    const { id, abilityName, abilityOverride, overrideMapContainer } = this
    return {
      instancedAbilityId: id,
      abilityName,
      abilityOverride,
      overrideMap: overrideMapContainer.export()
    }
  }
}