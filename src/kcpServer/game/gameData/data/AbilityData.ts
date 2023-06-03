import Loader from "$/gameData/loader"
import ConfigAbility from "$DT/BinOutput/Config/ConfigAbility"
import ConfigAbilityAction from "$DT/BinOutput/Config/ConfigAbility/Action"
import ConfigAbilityMixin from "$DT/BinOutput/Config/ConfigAbility/Mixin"
import ConfigAbilityGroup from "$DT/BinOutput/Config/ConfigAbilityGroup"
import { AbilityConfigIdxEnum, AbilityModifierConfigIdxEnum } from "@/types/enum"
import AbilityDataGroup from "@/types/gameData/AbilityData"
import { AbilityString } from "@/types/proto"
import { getStringHash } from "@/utils/hash"

const sortStr = (a: string, b: string) => (a < b ? -1 : 1)

class AbilityDataLoader extends Loader {
  declare data: AbilityDataGroup

  hashMap: { [hash: number]: string }
  abilityMap: { [name: string]: ConfigAbility }

  constructor() {
    super("AbilityData", "message.cache.debug.ability")

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
      const val = localId % (d * 64)
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

  private getActionList(
    actions: (ConfigAbilityAction | ConfigAbilityMixin)[]
  ): (ConfigAbilityAction | ConfigAbilityMixin)[] {
    const actionList = []
    if (!Array.isArray(actions)) return actionList

    for (const action of actions) {
      actionList.push(action)
      switch (action.$type) {
        case "DummyAction":
          actionList.push(...this.getActionList(action.ActionList))
          break
        case "Predicated":
        case "Randomed":
          actionList.push(...this.getActionList(action.SuccessActions))
          actionList.push(...this.getActionList(action.FailActions))
          break
        case "Repeated":
          actionList.push(...this.getActionList(action.Actions))
          break
        case "TryTriggerPlatformStartMove":
          actionList.push(...this.getActionList(action.FailActions))
          break
      }
    }

    return actionList
  }

  private addString(str: string): void {
    if (typeof str !== "string") return
    this.hashMap[getStringHash(str)] = str
  }

  private loadAbilityConfig(config: ConfigAbility) {
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
      if (groupName === "Group") continue

      const group: { [name: string]: { [override: string]: ConfigAbility }[] } = data[groupName]
      if (group == null) continue

      for (const name in group) {
        const configList = group[name]
        if (!Array.isArray(configList)) continue

        for (const config of configList) this.loadAbilityConfig(config?.Default)
      }
    }
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getAbilityGroup(name: string): ConfigAbilityGroup {
    return this.data?.Group?.[name] || null
  }

  getAbility(name: string): ConfigAbility {
    return this.abilityMap[name] || null
  }

  getActionByLocalId(abilityName: string, localId: number): ConfigAbilityAction | ConfigAbilityMixin {
    const configInfo = this.parseLocalId(localId)
    const abilityData = this.getAbility(abilityName)
    if (configInfo == null || !abilityData) return null

    const { typeTag, actionID, configIdx, mixinIdx, modifierIdx } = configInfo

    switch (typeTag) {
      case 1: {
        return this.getActionList(abilityData[AbilityConfigIdxEnum[configIdx]])[actionID - 1]
      }
      case 2: {
        return abilityData.AbilityMixins?.[mixinIdx]
      }
      case 3: {
        const modifier = Object.entries(abilityData.Modifiers || {}).sort((a, b) => sortStr(a[0], b[0]))[
          modifierIdx
        ]?.[1]
        if (modifier == null) return null

        return this.getActionList(modifier[AbilityModifierConfigIdxEnum[configIdx]])[actionID - 1]
      }
      case 4: {
        const modifier = Object.entries(abilityData.Modifiers || {}).sort((a, b) => sortStr(a[0], b[0]))[
          modifierIdx
        ]?.[1]
        if (modifier == null) return null

        return modifier.ModifierMixins?.[mixinIdx]
      }
      default:
        return null
    }
  }

  lookupString(abilityString: AbilityString): string | null {
    const { str, hash } = abilityString || {}
    if (str) return str

    return this.hashMap[hash] || hash?.toString() || null
  }
}

let loader: AbilityDataLoader
export default (() => (loader = loader || new AbilityDataLoader()))()
