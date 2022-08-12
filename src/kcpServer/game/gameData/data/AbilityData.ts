import abilityHash from '$/ability/abilityHash'
import Loader from '$/gameData/loader'
import { AbilityConfigIdxEnum, AbilityModifierConfigIdxEnum } from '@/types/enum'
import AbilityDataGroup from '@/types/gameData/AbilityData'
import AbilityConfig from '@/types/gameData/BinOutput/ConfigAbility'
import ActionConfig from '@/types/gameData/BinOutput/ConfigAbility/Action'
import { AbilityString } from '@/types/proto'

const sortStr = (a: string, b: string) => a < b ? -1 : 1

class AbilityDataLoader extends Loader {
  declare data: AbilityDataGroup

  hashMap: { [hash: number]: string }
  abilityMap: { [name: string]: AbilityConfig }

  constructor() {
    super('AbilityData')

    this.hashMap = {}
    this.abilityMap = {}
  }

  private parseLocalId(localId: number) {
    const valList = [0, 0, 0, 0]
    const typeTag = localId % 8
    localId -= typeTag

    let i = valList.length
    let d = 8
    while (localId > 0) {
      const val = (localId % (d * 64))
      valList[--i] = val / d
      localId -= val
      d *= 64
    }

    switch (typeTag) {
      case 1: {
        const [actionID, configIdx] = valList.slice(-2)
        return { typeTag, actionID, configIdx }
      }
      case 2: {
        const [actionID, configIdx, mixinIdx] = valList.slice(-3)
        return { typeTag, actionID, configIdx, mixinIdx }
      }
      case 3: {
        const [actionID, configIdx, modifierIdx] = valList.slice(-3)
        return { typeTag, actionID, configIdx, modifierIdx }
      }
      case 4: {
        const [actionID, configIdx, mixinIdx, modifierIdx] = valList.slice(-4)
        return { typeTag, actionID, configIdx, mixinIdx, modifierIdx }
      }
      default:
        return null
    }
  }

  private addString(str: string): void {
    if (typeof str !== 'string') return
    this.hashMap[abilityHash(str)] = str
  }

  private loadAbilityConfig(config: AbilityConfig) {
    if (config == null) return

    const { abilityMap } = this
    const { AbilityName, AbilitySpecials, Modifiers } = config

    abilityMap[AbilityName] = config

    this.addString(AbilityName)
    if (AbilitySpecials != null) {
      for (const key in AbilitySpecials) this.addString(key)
    }
    if (Modifiers != null) {
      for (const key in Modifiers) this.addString(key)
    }
  }

  async load(): Promise<void> {
    const { busy } = this
    await super.load()
    if (busy) return

    const { data } = this
    for (const groupName in data) {
      const group: { [name: string]: { [override: string]: AbilityConfig }[] } = data[groupName]
      if (group == null) continue

      for (const name in group) {
        const configList = group[name]
        if (!Array.isArray(configList)) continue

        for (const config of configList) this.loadAbilityConfig(config?.Default)
      }
    }
  }

  async getData(): Promise<AbilityDataGroup> {
    return super.getData()
  }

  async getAbility(name: string): Promise<AbilityConfig> {
    await this.getData()
    return this.abilityMap[name] || null
  }

  async getActionByLocalId(abilityName: string, localId: number): Promise<ActionConfig> {
    const configInfo = this.parseLocalId(localId)
    const abilityData = await this.getAbility(abilityName)
    if (configInfo == null || !abilityData) return null

    const { typeTag, actionID, configIdx, modifierIdx } = configInfo

    switch (typeTag) {
      case 1: {
        const actionList = abilityData[AbilityConfigIdxEnum[configIdx]]
        if (!Array.isArray(actionList)) return null

        return actionList[actionID - 1]
      }
      case 2: {
        break
      }
      case 3: {
        const modifier = Object.entries(abilityData.Modifiers || {})
          .sort((a, b) => sortStr(a[0], b[0]))[modifierIdx]?.[1]
        if (modifier == null) return null

        const actionList = modifier[AbilityModifierConfigIdxEnum[configIdx]]
        if (!Array.isArray(actionList)) return null

        return actionList[actionID - 1]
      }
      case 4: {
        break
      }
    }

    return null
  }

  lookupString(abilityString: AbilityString) {
    const { str, hash } = abilityString || {}
    if (str) return str

    return this.hashMap[hash] || null
  }
}

let loader: AbilityDataLoader
export default (() => loader = loader || new AbilityDataLoader())()