import AbilityManager from '$/manager/abilityManager'
import { AbilityEmbryo } from '@/types/proto'
import abilityHash from './abilityHash'

export default class Embryo {
  manager: AbilityManager
  id: number

  name: string
  overrideName: string

  constructor(manager: AbilityManager, id: number, name: string, overrideName: string) {
    this.manager = manager
    this.id = id

    this.name = name
    this.overrideName = overrideName
  }

  export(): AbilityEmbryo {
    const { id, name, overrideName } = this
    return {
      abilityId: id,
      abilityNameHash: abilityHash(name),
      abilityOverrideNameHash: abilityHash(overrideName)
    }
  }
}