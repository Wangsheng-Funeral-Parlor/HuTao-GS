import { AbilityString } from '@/types/proto'

export default class AbilityStringManager {
  private strList: AbilityString[]

  constructor() {
    this.strList = []
  }

  addString(str: string): void {
    if (this.getByString(str) != null) return

    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((str.charCodeAt(i) + 131 * hash) & 0xFFFFFFFF) >>> 0
    }

    this.strList.push({ hash, str })
  }

  getByString(str: string): AbilityString {
    return this.strList.find(i => i.str === str)
  }

  getByHash(hash: number): AbilityString {
    return this.strList.find(i => i.hash === hash)
  }

  getByAbilityString(abilityString: AbilityString) {
    return this.strList.find(i => this.compare(i, abilityString)) || abilityString
  }

  compare(a: AbilityString, b: AbilityString) {
    return a?.hash === b?.hash || a?.str === b?.str
  }
}