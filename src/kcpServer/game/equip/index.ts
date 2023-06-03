import Avatar from "$/entity/avatar"
import Player from "$/player"
import { EquipTypeEnum, ItemTypeEnum } from "@/types/enum"
import { EquipInfo } from "@/types/proto"
import EquipUserData from "@/types/user/EquipUserData"

export default class Equip {
  player: Player

  guid: bigint
  itemId: number
  gadgetId: number
  itemType: ItemTypeEnum
  type: EquipTypeEnum

  equipped?: Avatar

  isLocked: boolean

  constructor(itemId: number, player: Player, itemType: ItemTypeEnum, type: EquipTypeEnum = EquipTypeEnum.EQUIP_NONE) {
    this.player = player

    this.itemId = itemId
    this.gadgetId = 0
    this.itemType = itemType
    this.type = type
  }

  async init(userData: EquipUserData) {
    const { player } = this
    const { guid, itemId, gadgetId, type, isLocked } = userData

    this.guid = player.guidManager.getGuid(BigInt(guid || 0)) || BigInt(guid || 0)
    this.itemId = itemId
    this.gadgetId = gadgetId
    this.type = type
    this.isLocked = isLocked
  }

  async initNew() {
    const { player } = this

    this.guid = player.guidManager.getGuid() || 0n
    this.isLocked = false
  }

  // placeholder
  export(): EquipInfo {
    return null
  }

  exportUserData(): EquipUserData {
    const { guid, itemId, gadgetId, type, isLocked } = this

    return {
      guid: guid.toString(),
      itemId,
      gadgetId,
      type,
      isLocked,
    }
  }
}
