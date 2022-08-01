import AbilityManager from '$/manager/abilityManager'
import { AbilityAppliedAbility, AbilityEmbryo } from '@/types/proto'

function abilityHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((str.charCodeAt(i) + 131 * hash) & 0xFFFFFFFF) >>> 0
  }
  return hash
}

export default class Ability {
  manager: AbilityManager
  id: number
  instancedId: number

  name: string
  overrideName: string

  constructor(name: string = 'Default', overrideName: string = 'Default') {
    this.manager = null
    this.id = null
    this.instancedId = null

    this.name = name
    this.overrideName = overrideName
  }

  exportAppliedAbility(): AbilityAppliedAbility {
    const { instancedId, name, overrideName } = this
    return {
      instancedAbilityId: instancedId,
      abilityName: { hash: abilityHash(name) },
      abilityOverride: { hash: abilityHash(overrideName) },
      overrideMap: []
    }
  }

  exportEmbryo(): AbilityEmbryo {
    const { id, name, overrideName } = this
    return {
      abilityId: id,
      abilityNameHash: abilityHash(name),
      abilityOverrideNameHash: abilityHash(overrideName)
    }
  }
}