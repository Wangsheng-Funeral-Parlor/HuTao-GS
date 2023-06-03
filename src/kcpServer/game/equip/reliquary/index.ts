import Equip from "$/equip"
import ReliquaryData from "$/gameData/data/ReliquaryData"
import Player from "$/player"
import { EquipTypeEnum, FightPropEnum, ItemTypeEnum } from "@/types/enum"
import { EquipInfo, SceneReliquaryInfo } from "@/types/proto"
import ReliquaryUserData from "@/types/user/ReliquaryUserData"

export default class Reliquary extends Equip {
  level: number
  exp: number

  maxLevel: number
  rankLevel: number
  setId: number

  mainDepotId: number
  appendDepotId: number
  appendNum: number

  mainPropId: number
  appendPropIdList: number[]

  mainPropType: FightPropEnum
  mainPropValue: number
  subStatMap: { [propType: number]: number }

  constructor(itemId: number, player: Player) {
    super(itemId, player, ItemTypeEnum.ITEM_RELIQUARY, EquipTypeEnum.EQUIP_NONE)

    this.mainPropId = 0
    this.appendPropIdList = []

    this.mainPropType = FightPropEnum.FIGHT_PROP_NONE
    this.mainPropValue = 0
    this.subStatMap = {}
  }

  private async loadReliquaryData() {
    const { itemId } = this
    const reliquaryData = await ReliquaryData.getReliquary(itemId)

    this.gadgetId = reliquaryData?.GadgetId || 0

    this.maxLevel = reliquaryData?.MaxLevel || 1
    this.rankLevel = reliquaryData?.RankLevel || 0
    this.setId = reliquaryData?.SetId || 0

    this.mainDepotId = reliquaryData?.MainPropDepotId || 0
    this.appendDepotId = reliquaryData?.AppendPropDepotId || 0
    this.appendNum = reliquaryData?.AppendPropNum || 0

    this.type = EquipTypeEnum[reliquaryData?.EquipType] || EquipTypeEnum.EQUIP_NONE
  }

  private async setMainProp(id: number) {
    const propData = await ReliquaryData.getMainProp(id)
    if (propData == null) return

    this.mainPropId = id
    this.mainPropType = FightPropEnum[propData?.PropType] || FightPropEnum.FIGHT_PROP_NONE

    await this.updateMainStat()
  }

  private async randomMainProp() {
    const { mainDepotId } = this
    const candidateList = await ReliquaryData.getMainPropsByDepot(mainDepotId)
    const candidate = candidateList[Math.floor(Math.random() * candidateList.length)]

    await this.setMainProp(candidate?.Id)
  }

  private async addRandomAppendProp() {
    const { appendDepotId, mainPropId, appendPropIdList } = this
    const blackList: string[] = []

    const mainPropType = (await ReliquaryData.getMainProp(mainPropId))?.PropType
    if (mainPropType != null) blackList.push(mainPropType)

    for (const appendPropId of appendPropIdList) {
      const propType = (await ReliquaryData.getAffix(appendPropId))?.PropType
      if (propType == null || blackList.includes(propType)) continue

      blackList.push(propType)
    }

    const candidateList = (await ReliquaryData.getAffixsByDepot(appendDepotId))
      .filter((data) => !blackList.includes(data.PropType))
      .map((data) => data.Id)

    const candidate = candidateList[Math.floor(Math.random() * candidateList.length)]
    if (candidate == null) return

    appendPropIdList.push(candidate)
  }

  private async upgradeRandomAppendProp() {
    const { appendDepotId, appendPropIdList } = this
    const whitelist: string[] = []

    for (const appendPropId of appendPropIdList) {
      const propType = (await ReliquaryData.getAffix(appendPropId))?.PropType
      if (propType == null || whitelist.includes(propType)) continue

      whitelist.push(propType)
    }

    const candidateList = (await ReliquaryData.getAffixsByDepot(appendDepotId))
      .filter((data) => whitelist.includes(data.PropType))
      .map((data) => data.Id)

    const candidate = candidateList[Math.floor(Math.random() * candidateList.length)]
    if (candidate == null) return

    appendPropIdList.push(candidate)
  }

  private async addAppendProp() {
    const { appendPropIdList } = this

    if (appendPropIdList.length < 4) await this.addRandomAppendProp()
    else await this.upgradeRandomAppendProp()

    await this.updateSubStats()
  }

  private async updateMainStat() {
    const { level, rankLevel: rank, mainPropType } = this
    const levelData = await ReliquaryData.getLevel(level, rank)
    if (levelData == null) return

    const prop = levelData.AddProps?.find((p) => p?.PropType === FightPropEnum[mainPropType])

    this.mainPropValue = prop?.Value || 0
  }

  private async updateSubStats() {
    const { appendPropIdList, subStatMap } = this

    // clear stats
    for (const type in subStatMap) delete subStatMap[type]

    for (const appendPropId of appendPropIdList) {
      const affixData = await ReliquaryData.getAffix(appendPropId)
      const type = FightPropEnum[affixData?.PropType] || FightPropEnum.FIGHT_PROP_NONE
      const value = parseFloat(affixData?.PropValue?.toString()) || 0
      const origValue = subStatMap[type] || 0

      if (isNaN(value)) continue

      subStatMap[type] = origValue + value
    }
  }

  async init(userData: ReliquaryUserData) {
    await this.loadReliquaryData()
    await super.init(userData)

    const { level, exp, mainProp, appendPropList } = userData
    const { appendNum, appendPropIdList } = this

    this.level = level || 1
    this.exp = exp || 0

    if (mainProp == null) await this.randomMainProp()
    else this.setMainProp(mainProp)

    appendPropIdList.splice(0)

    const filteredAppendPropList = appendPropList.map((id) => parseInt(id?.toString())).filter((id) => !isNaN(id))
    if (filteredAppendPropList.length === 0) {
      for (let i = 0; i < appendNum; i++) await this.addAppendProp()
    } else {
      appendPropIdList.push(...filteredAppendPropList)
    }

    await this.updateSubStats()
  }

  async initNew() {
    await this.loadReliquaryData()
    await super.initNew()

    const { appendNum } = this

    this.level = 1
    this.exp = 0

    await this.randomMainProp()
    for (let i = 0; i < appendNum; i++) await this.addAppendProp()
  }

  exportSceneReliquaryInfo(): SceneReliquaryInfo {
    const { itemId, guid, level } = this
    return {
      itemId,
      guid: guid.toString(),
      level,
    }
  }

  export(): EquipInfo {
    const { level, exp, mainPropId, appendPropIdList, isLocked } = this
    return {
      reliquary: {
        level,
        exp,
        mainPropId,
        appendPropIdList,
      },
      isLocked,
    }
  }

  exportUserData(): ReliquaryUserData {
    const { level, exp, mainPropId, appendPropIdList } = this

    return Object.assign(
      {
        level,
        exp,
        mainProp: mainPropId,
        appendPropList: appendPropIdList,
      },
      super.exportUserData()
    )
  }
}
