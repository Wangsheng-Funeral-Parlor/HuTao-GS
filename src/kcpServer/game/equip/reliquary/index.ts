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

    const reliquaryData = ReliquaryData.get(itemId)
    if (!reliquaryData) return

    this.setId = reliquaryData.SetId

    this.mainDepotId = reliquaryData.MainPropDepotId
    this.appendDepotId = reliquaryData.AppendPropDepotId
    this.appendNum = reliquaryData.AppendPropNum

    this.equipType = ReliquaryEquipTypeEnum[reliquaryData.EquipType]
  }

  initNew() {
    this.level = 1
    this.exp = 0

    this.mainPropId = this.randomFromMain()
    this.appendPropIdList.push(this.randomFromAppend())
  }

  randomFromMain() {
    const { mainDepotId } = this
    const candidates = ReliquaryData.getMainPropsByDepot(mainDepotId).map(data => data.Id)

    return candidates[Math.floor(Math.random() * candidates.length)]
  }

  randomFromAppend() {
    const { appendDepotId, appendNum, appendPropIdList } = this
    const groups = appendPropIdList
      .map(id => ReliquaryData.getAffix(id)?.GroupId)
      .filter((groupId, i, self) => groupId != null && self.indexOf(groupId) === i) // deduplicate and remove null
    const candidates = ReliquaryData.getAffixsByDepot(appendDepotId)
      .filter(data => groups.length < appendNum || groups.includes(data.GroupId))
      .map(data => data.Id)

    return candidates[Math.floor(Math.random() * candidates.length)]
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