import Equip from '$/equip'
import Reliquary from '$/equip/reliquary'
import Weapon from '$/equip/weapon'
import Material from '$/material'
import newGuid from '$/utils/newGuid'
import { EquipTypeEnum } from '@/types/enum/equip'
import { ItemInterface } from '@/types/game/item'
import EquipUserData from '@/types/user/EquipUserData'
import { ItemTypeEnum, ItemUserData } from '@/types/user/InventoryUserData'
import MaterialUserData from '@/types/user/MaterialUserData'

export default class Item {
  guid: bigint
  itemId: number

  material?: Material
  equip?: Equip
  furniture?: any

  constructor(content?: Material | Equip) {
    this.guid = content?.guid || newGuid()

    if (content instanceof Material) this.material = content
    if (content instanceof Equip) this.equip = content

    this.itemId = content?.itemId
  }

  private async initEquip(userData: EquipUserData) {
    const { itemId, type } = userData

    switch (type) {
      case EquipTypeEnum.EQUIP_WEAPON:
        this.equip = new Weapon(itemId)
        break
      case EquipTypeEnum.EQUIP_BRACER:
      case EquipTypeEnum.EQUIP_NECKLACE:
      case EquipTypeEnum.EQUIP_SHOES:
      case EquipTypeEnum.EQUIP_RING:
      case EquipTypeEnum.EQUIP_DRESS:
        this.equip = new Reliquary(itemId)
        break
      default:
        this.equip = new Equip(itemId)
    }

    await this.equip.init(userData)
  }

  get count() {
    const { material } = this
    if (material) return material.count

    return 1
  }

  get stackLimit() {
    const { material } = this

    if (material) return material.stackLimit

    return 1
  }

  async init(userData: ItemUserData) {
    const { guid, itemId, type, data } = userData

    this.guid = BigInt(guid)
    this.itemId = itemId

    switch (type) {
      case ItemTypeEnum.MATERIAL:
        this.material = new Material(itemId)
        await this.material.init(<MaterialUserData>data)
        break
      case ItemTypeEnum.EQUIP:
        await this.initEquip(<EquipUserData>data)
        break
    }
  }

  stack(item: Item): boolean {
    const { material } = this

    if (material && item.material) return material.stack(item.material)

    return false
  }

  unstack(amount: number, commit: boolean = true): false | number {
    const { material } = this

    if (material) return material.unstack(amount, commit)

    return amount - 1
  }

  export() {
    const { itemId, guid, material, equip, furniture } = this
    const ret: ItemInterface = {
      itemId,
      guid: guid.toString()
    }

    if (material) ret.material = material.export()
    if (equip) ret.equip = equip.export()
    if (furniture) ret.furniture = furniture.export()

    return ret
  }

  exportUserData(): ItemUserData {
    const { guid, itemId, material, equip, furniture } = this

    let type = ItemTypeEnum.NONE
    if (material) type = ItemTypeEnum.MATERIAL
    if (equip) type = ItemTypeEnum.EQUIP
    if (furniture) type = ItemTypeEnum.FURNITURE

    return {
      guid: guid.toString(),
      itemId,
      type,

      data: (material || equip || furniture)?.exportUserData()
    }
  }
}