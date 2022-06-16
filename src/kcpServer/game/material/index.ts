import newGuid from '$/utils/newGuid'
import { MaterialInterface } from '@/types/game/item'
import MaterialData from '$/gameData/data/MaterialData'
import MaterialUserData from '@/types/user/MaterialUserData'

export default class Material {
  guid: bigint
  itemId: number

  count: number
  stackLimit: number

  constructor(itemId: number, guid?: bigint, count: number = 1) {
    this.itemId = itemId
    this.guid = guid || newGuid()

    const materialData = MaterialData.get(itemId)

    this.stackLimit = materialData?.StackLimit || 1
    this.count = Math.min(this.stackLimit, count)
  }

  init(userData: MaterialUserData) {
    const { guid, itemId, count, stackLimit } = userData

    const materialData = MaterialData.get(itemId)

    this.guid = BigInt(guid) || newGuid()
    this.itemId = itemId || 0
    this.stackLimit = materialData?.StackLimit || stackLimit
    this.count = Math.min(this.stackLimit, count || 1)
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