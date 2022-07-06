import newGuid from '$/utils/newGuid'
import { MaterialInterface } from '@/types/game/item'
import MaterialData from '$/gameData/data/MaterialData'
import MaterialUserData from '@/types/user/MaterialUserData'

export default class Material {
  guid: bigint
  itemId: number

  count: number
  stackLimit: number

  constructor(itemId: number) {
    this.itemId = itemId
  }

  private async loadMaterialData() {
    const { itemId } = this
    const materialData = await MaterialData.getMaterial(itemId)

    this.stackLimit = materialData?.StackLimit || 1
  }

  static async create(itemId: number, count: number = 1): Promise<Material> {
    const material = new Material(itemId)
    await material.initNew(count)
    return material
  }

  async init(userData: MaterialUserData) {
    await this.loadMaterialData()

    const { itemId: id, stackLimit } = this
    const { guid, itemId, count } = userData

    if (itemId !== id) return // Mismatch item id

    this.guid = BigInt(guid) || newGuid()
    this.count = Math.min(stackLimit, count || 1)
  }

  async initNew(count: number = 1, guid?: bigint) {
    await this.loadMaterialData()

    this.guid = guid || newGuid()
    this.count = Math.min(this.stackLimit, count)
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

  export(): MaterialInterface {
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