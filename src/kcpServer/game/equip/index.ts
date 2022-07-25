import Avatar from '$/entity/avatar'
import newGuid from '$/utils/newGuid'
import { EquipTypeEnum } from '@/types/enum'
import { EquipInfo } from '@/types/proto'
import EquipUserData from '@/types/user/EquipUserData'

export default class Equip {
  guid: bigint
  itemId: number
  type: EquipTypeEnum

  equipped?: Avatar

  isLocked: boolean

  constructor(itemId: number, guid?: bigint, type: EquipTypeEnum = EquipTypeEnum.EQUIP_NONE) {
    this.itemId = itemId
    this.guid = guid || newGuid()
    this.type = type
  }

  async init(userData: EquipUserData) {
    const { guid, itemId, type, isLocked } = userData

    this.guid = BigInt(guid)
    this.itemId = itemId
    this.type = type
    this.isLocked = isLocked
  }

  async initNew() {
    this.isLocked = false
  }

  // placeholder
  export(): EquipInfo { return null }

  exportUserData(): EquipUserData {
    const { guid, itemId, type, isLocked } = this

    return {
      guid: guid.toString(),
      itemId,
      type,
      isLocked
    }
  }
}