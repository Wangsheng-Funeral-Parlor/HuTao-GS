import StoreItemChange from '#/packets/StoreItemChange'
import StoreItemDel from '#/packets/StoreItemDel'
import { ItemTypeEnum } from '@/types/enum'
import { ItemInfo } from '@/types/proto'
import InventoryUserData from '@/types/user/InventoryUserData'
import Player from '..'
import Equip from '../../equip'
import Material from '../../material'
import Item from './item'

export default class Inventory {
  player: Player

  itemList: Item[]

  constructor(player: Player) {
    this.player = player

    this.itemList = []
  }

  private async addVirtualItem(item: Item): Promise<boolean> {
    const { player } = this
    const { itemId, count } = item

    switch (itemId) {
      case 101: // Character exp
        break
      case 102: // Adventure exp
        break
      case 105: // Companionship exp
        break
      case 106: // Resin
        break
      case 107:  // Legendary Key
        break
      case 201: // Primogem
        await player.addPrimogem(count)
        break
      case 202: // Mora
        await player.addMora(count)
        break
      case 203: // Genesis Crystals
        await player.addGenesisCrystal(count)
        break
      case 204: // Home Coin
        break
      default:
        return false
    }

    return true
  }

  private async removeItem(item: Item, commit: boolean = true, notify: boolean = true) {
    const { player, itemList } = this
    const index = itemList.indexOf(item)

    if (index === -1) return item.count

    if (commit) {
      if (notify) await StoreItemDel.sendNotify(player.context, [item])

      itemList.splice(index, 1)
    }

    return 0
  }

  private async removeItemId(itemId: number, amount: number = 1, commit: boolean = true, notify: boolean = true) {
    const { player, itemList } = this
    const changedItemList = []

    let remaining = amount

    for (const item of itemList) {
      if (remaining <= 0) break
      if (item.itemId !== itemId) continue

      const leftover = item.unstack(remaining, commit)
      if (leftover === false) continue

      changedItemList.push(item)

      remaining = leftover
    }

    if (commit) {
      if (notify) {
        await StoreItemChange.sendNotify(player.context, changedItemList.filter(item => item.count > 0))
        await StoreItemDel.sendNotify(player.context, changedItemList.filter(item => item.count <= 0))
      }

      this.itemList = itemList.filter(item => item.count > 0)
    }

    return remaining
  }

  async init(userData: InventoryUserData) {
    const { player, itemList } = this
    const { itemDataList } = userData
    if (!Array.isArray(itemDataList)) return

    for (const itemData of itemDataList) {
      const item = new Item()
      await item.init(itemData, player)

      itemList.push(item)
    }
  }

  async add(obj: Material | Equip, notify: boolean = true): Promise<void> {
    await this.addItem(new Item(obj), notify)
  }

  async addItem(item: Item, notify: boolean = true) {
    const { player, itemList } = this
    const { itemType, material } = item

    if (material?.useOnGain) return this.useItem(item)
    if (itemType === ItemTypeEnum.ITEM_VIRTUAL && await this.addVirtualItem(item)) return

    const changedItemList = []

    for (const invItem of itemList) {
      if (item.count <= 0) break
      if (invItem.stack(item)) changedItemList.push(invItem)
    }

    if (item.count > 0) {
      itemList.push(item)
      changedItemList.push(item)
    }

    if (notify) await StoreItemChange.sendNotify(player.context, changedItemList)
  }

  async remove(item: Item | number, amount: number = 1, commit: boolean = true, notify: boolean = true): Promise<number> {
    if (typeof item === 'number') {
      // item id
      return this.removeItemId(item, amount, commit, notify)
    } else {
      // item
      return this.removeItem(item, commit, notify)
    }
  }

  async removeGuid(guid: bigint, notify: boolean = true) {
    const { player, itemList } = this
    const deletedItemList = []

    guid = player.guidManager.getGuid(guid)

    for (const item of itemList) {
      if (item.guid !== guid) continue

      deletedItemList.push(item)
    }

    if (notify) await StoreItemDel.sendNotify(player.context, deletedItemList)

    this.itemList = itemList.filter(item => !deletedItemList.includes(item))
  }

  async useItem(item: Item, count?: number) {
    const { material } = item
    if (material == null) return

    await material.use(count)
    if (material.count > 0) return

    await this.removeItem(item)
  }

  getItem(guid: bigint) {
    const { player, itemList } = this
    guid = player.guidManager.getGuid(guid)
    return itemList.find(item => item.guid === guid)
  }

  exportItemList(): ItemInfo[] {
    return this.itemList.map(item => item.export())
  }

  exportUserData(): InventoryUserData {
    const { itemList } = this

    return {
      itemDataList: itemList.map(item => item.exportUserData())
    }
  }
}