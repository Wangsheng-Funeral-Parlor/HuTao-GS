import Player from ".."

import Equip from "$/equip"
import Reliquary from "$/equip/reliquary"
import Weapon from "$/equip/weapon"
import Material from "$/material"
import { EquipTypeEnum, ItemTypeEnum } from "@/types/enum"
import { ItemInfo } from "@/types/proto"
import EquipUserData from "@/types/user/EquipUserData"
import { ItemDataTypeEnum, ItemUserData } from "@/types/user/InventoryUserData"
import MaterialUserData from "@/types/user/MaterialUserData"

export default class Item {
  itemId: number
  gadgetId: number

  material?: Material
  equip?: Equip
  furniture?: any

  constructor(content?: Material | Equip) {
    if (content instanceof Material) this.material = content
    if (content instanceof Equip) this.equip = content

    this.itemId = content?.itemId
    this.gadgetId = content?.gadgetId
  }

  private async initEquip(userData: EquipUserData, player: Player) {
    const { itemId, type } = userData

    switch (type) {
      case EquipTypeEnum.EQUIP_WEAPON:
        this.equip = new Weapon(itemId, player)
        break
      case EquipTypeEnum.EQUIP_BRACER:
      case EquipTypeEnum.EQUIP_NECKLACE:
      case EquipTypeEnum.EQUIP_SHOES:
      case EquipTypeEnum.EQUIP_RING:
      case EquipTypeEnum.EQUIP_DRESS:
        this.equip = new Reliquary(itemId, player)
        break
      default:
        this.equip = new Equip(itemId, player, ItemTypeEnum.ITEM_NONE, type)
    }

    await this.equip.init(userData)
  }

  get player(): Player {
    const { equip, material, furniture } = this
    return equip?.player || material?.player || furniture?.player || null
  }

  get guid(): bigint {
    const { equip, material, furniture } = this
    return equip?.guid || material?.guid || furniture?.guid || 0n
  }

  get itemType(): ItemTypeEnum {
    const { equip, material, furniture } = this
    return equip?.itemType || material?.itemType || furniture?.itemType || ItemTypeEnum.ITEM_NONE
  }

  get count(): number {
    const { material } = this
    if (material) return material.count

    return 1
  }

  get stackLimit(): number {
    const { material } = this
    if (material) return material.stackLimit

    return 1
  }

  async init(userData: ItemUserData, player: Player) {
    const { itemId, gadgetId, type, data } = userData

    this.itemId = itemId
    this.gadgetId = gadgetId

    switch (type) {
      case ItemDataTypeEnum.MATERIAL:
        this.material = new Material(player, itemId)
        await this.material.init(<MaterialUserData>data)
        break
      case ItemDataTypeEnum.EQUIP:
        await this.initEquip(<EquipUserData>data, player)
        break
    }
  }

  stack(item: Item): boolean {
    const { material } = this
    if (material && item.material) return material.stack(item.material)

    return false
  }

  unstack(amount: number, commit = true): false | number {
    const { material } = this
    if (material) return material.unstack(amount, commit)

    return amount - 1
  }

  export(): ItemInfo {
    const { itemId, guid, material, equip, furniture } = this
    const ret: ItemInfo = {
      itemId,
      guid: guid.toString(),
    }

    if (material) ret.material = material.export()
    if (equip) ret.equip = equip.export()
    if (furniture) ret.furniture = furniture.export()

    return ret
  }

  exportUserData(): ItemUserData {
    const { itemId, gadgetId, material, equip, furniture } = this

    let type = ItemDataTypeEnum.NONE
    if (material) type = ItemDataTypeEnum.MATERIAL
    if (equip) type = ItemDataTypeEnum.EQUIP
    if (furniture) type = ItemDataTypeEnum.FURNITURE

    return {
      itemId,
      gadgetId,
      type,

      data: (material || equip || furniture)?.exportUserData(),
    }
  }
}
