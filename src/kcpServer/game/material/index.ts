import MaterialData from '$/gameData/data/MaterialData'
import Player from '$/player'
import { ItemTypeEnum, ItemUseOpEnum, MaterialTypeEnum } from '@/types/enum'
import { MaterialInfo } from '@/types/proto'
import MaterialUserData from '@/types/user/MaterialUserData'

export default class Material {
  player: Player

  guid: bigint
  itemId: number
  gadgetId: number
  itemType: ItemTypeEnum

  materialType: MaterialTypeEnum
  count: number
  stackLimit: number
  useList: { op: ItemUseOpEnum, param: number[] }[]
  useOnGain: boolean

  constructor(player: Player, itemId: number) {
    this.player = player

    this.itemId = itemId
  }

  private async loadMaterialData() {
    const { itemId } = this
    const materialData = await MaterialData.getMaterial(itemId)

    this.gadgetId = materialData?.GadgetId || 0

    this.itemType = ItemTypeEnum[materialData?.ItemType] || ItemTypeEnum.ITEM_NONE
    this.materialType = MaterialTypeEnum[materialData?.MaterialType] || MaterialTypeEnum.MATERIAL_NONE

    this.stackLimit = materialData?.StackLimit || 1

    this.useList = (materialData?.ItemUse || []).filter(u => u.UseOp).map(u => ({
      op: ItemUseOpEnum[u.UseOp],
      param: u.UseParam.filter(p => p).map(p => parseInt(p))
    }))
    this.useOnGain = !!materialData?.UseOnGain
  }

  static async create(player: Player, itemId: number, count: number = 1): Promise<Material> {
    const material = new Material(player, itemId)
    await material.initNew(count)
    return material
  }

  async init(userData: MaterialUserData) {
    await this.loadMaterialData()

    const { player, itemId: id, stackLimit } = this
    const { guid, itemId, count } = userData

    if (itemId !== id) return // Mismatch item id

    this.guid = player.guidManager.getGuid(BigInt(guid || 0))
    this.count = Math.min(stackLimit, count || 1)
  }

  async initNew(count: number = 1) {
    await this.loadMaterialData()

    const { player, stackLimit } = this

    this.guid = player.guidManager.getGuid()
    this.count = Math.min(stackLimit, count)
  }

  stack(material: Material): boolean {
    const { itemId, stackLimit, count } = this
    if (itemId !== material.itemId) return false

    const stacked = Math.min(stackLimit - count, material.count)

    this.count += stacked
    material.count -= stacked

    return stacked > 0
  }

  unstack(amount: number, commit: boolean = true): false | number {
    const { count } = this

    const removed = Math.min(count, amount)
    const leftover = amount - removed

    if (removed === 0) return false

    if (commit) this.count -= removed

    return leftover
  }

  async use(count?: number) {
    if (count == null) count = this.count
    for (let i = 0; i < count; i++) await this.useOnce()
  }

  async useOnce() {
    const { player, useList, count } = this
    const { energyManager } = player

    if (count <= 0) return
    this.count--

    for (const use of useList) {
      const { op, param } = use
      switch (op) {
        case ItemUseOpEnum.ITEM_USE_ADD_ALL_ENERGY:
          await energyManager.addAllEnergy(...param)
          break
        case ItemUseOpEnum.ITEM_USE_ADD_ELEM_ENERGY:
          await energyManager.addElemEnergy(...param)
          break
      }
    }
  }

  export(): MaterialInfo {
    return {
      count: this.count
    }
  }

  exportUserData(): MaterialUserData {
    const { guid, itemId, count, stackLimit } = this

    return {
      guid: guid.toString(),
      itemId,
      count,
      stackLimit
    }
  }
}