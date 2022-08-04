import AbilityManager from '$/manager/abilityManager'
import { AbilityEmbryo, AbilityString } from '@/types/proto'

export default class Embryo {
  manager: AbilityManager
  id: number

  rawName: string
  rawOverrideName: string

  name: AbilityString
  overrideName: AbilityString

  constructor(manager: AbilityManager, id: number, name: string, overrideName: string) {
    this.manager = manager
    this.id = id

    this.rawName = name
    this.rawOverrideName = overrideName
  }

  async loadAbilityData() {
    // TODO: Implement
    return
  }

  async initNew() {
    await this.loadAbilityData()

    const { manager, rawName, rawOverrideName } = this
    const { stringManager } = manager

    stringManager.addString(rawName)
    stringManager.addString(rawOverrideName)

    this.name = stringManager.getByString(rawName)
    this.overrideName = stringManager.getByString(rawOverrideName)
  }

  export(): AbilityEmbryo {
    const { id, name, overrideName } = this
    return {
      abilityId: id,
      abilityNameHash: name?.hash,
      abilityOverrideNameHash: overrideName?.hash
    }
  }
}