import { AbilityAppliedAbility, AbilityEmbryo } from '@/types/game/ability'
import AbilityList from './abilityList'

function abilityHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((str.charCodeAt(i) + 131 * hash) & 0xFFFFFFFF) >>> 0
  }
  return hash
}

export default class Ability {
  abilityList: AbilityList

  id: number
  name: string
  overrideName: string

  constructor(abilityList: AbilityList, name: string, overrideName: string) {
    this.abilityList = abilityList

    this.id = 0
    this.name = name
    this.overrideName = overrideName
  }

  exportAppliedAbility(): AbilityAppliedAbility {
    const { id, name, overrideName } = this
    return {
      instancedAbilityId: id,
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