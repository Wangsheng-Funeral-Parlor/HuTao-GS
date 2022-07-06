import Equip from '$/equip'
import { ReliquaryEquipTypeEnum } from '@/types/enum/reliquary'
import { SceneReliquaryInfo } from '@/types/game/reliquary'
import { EquipInterface } from '@/types/game/item'
import ReliquaryData from '$/gameData/data/ReliquaryData'
import { EquipTypeEnum } from '@/types/user/EquipUserData'

export default class Reliquary extends Equip {
  level: number
  exp: number

  setId: number

  mainDepotId: number
  appendDepotId: number
  appendNum: number

  mainPropId: number
  appendPropIdList: number[]

  equipType: ReliquaryEquipTypeEnum

  constructor(itemId: number, guid?: bigint) {
    super(itemId, guid, EquipTypeEnum.RELIQUARY)

    this.appendPropIdList = []
  }

  private async loadReliquaryData() {
    const { itemId } = this
    const reliquaryData = await ReliquaryData.getReliquary(itemId)
    if (!reliquaryData) return

    this.setId = reliquaryData.SetId

    this.mainDepotId = reliquaryData.MainPropDepotId
    this.appendDepotId = reliquaryData.AppendPropDepotId
    this.appendNum = reliquaryData.AppendPropNum

    this.equipType = ReliquaryEquipTypeEnum[reliquaryData.EquipType]
  }

  async initNew() {
    await this.loadReliquaryData()

    this.level = 1
    this.exp = 0

    this.mainPropId = await this.randomFromMain()
    this.appendPropIdList.push(await this.randomFromAppend())
  }

  async randomFromMain() {
    const { mainDepotId } = this
    const candidateList = (await ReliquaryData.getMainPropsByDepot(mainDepotId)).map(data => data.Id)
    return candidateList[Math.floor(Math.random() * candidateList.length)]
  }

  async randomFromAppend() {
    const { appendDepotId, appendNum, appendPropIdList } = this
    const groupIdList: number[] = []

    for (let appendPropId of appendPropIdList) {
      const groupId = (await ReliquaryData.getAffix(appendPropId))?.GroupId
      if (groupId == null || groupIdList.includes(groupId)) continue

      groupIdList.push(groupId)
    }

    const candidateList = (await ReliquaryData.getAffixsByDepot(appendDepotId))
      .filter(data => groupIdList.length < appendNum || groupIdList.includes(data.GroupId))
      .map(data => data.Id)

    return candidateList[Math.floor(Math.random() * candidateList.length)]
  }

  exportSceneReliquaryInfo(): SceneReliquaryInfo {
    const { itemId, guid, level } = this
    return {
      itemId,
      guid: guid.toString(),
      level
    }
  }

  export(): EquipInterface {
    const { level, exp, mainPropId, appendPropIdList, isLocked } = this
    return {
      reliquary: {
        level,
        exp,
        mainPropId,
        appendPropIdList
      },
      isLocked
    }
  }
}