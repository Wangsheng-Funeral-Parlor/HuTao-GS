import StoreItemChange from '#/packets/StoreItemChange'
import StoreItemDel from '#/packets/StoreItemDel'
import { ItemInterface } from '@/types/game/item'
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

    for (let item of itemList) {
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
    const { itemList } = this
    const { itemDataList } = userData
    if (!Array.isArray(itemDataList)) return

    for (let itemData of itemDataList) {
      const item = new Item()
      await item.init(itemData)

      itemList.push(item)
    }
  }

  async add(obj: Material | Equip, notify: boolean = true): Promise<void> {
    const { player, itemList } = this

    const newItem = new Item(obj)
    const changedItemList = []

    for (let item of itemList) {
      if (newItem.count <= 0) break
      if (item.stack(newItem)) changedItemList.push(item)
    }

    if (newItem.count > 0) {
      itemList.push(newItem)
      changedItemList.push(newItem)
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

    for (let item of itemList) {
      if (item.guid !== guid) continue

      deletedItemList.push(item)
    }

    if (notify) await StoreItemDel.sendNotify(player.context, deletedItemList)

    this.itemList = itemList.filter(item => !deletedItemList.includes(item))
  }

  getItem(guid: bigint) {
    return this.itemList.find(item => item.guid === guid)
  }

  exportItemList(): ItemInterface[] {
    return this.itemList.map(item => item.export())
  }

  exportUserData(): InventoryUserData {
    const { itemList } = this

    return {
      itemDataList: itemList.map(item => item.exportUserData())
    }
  }
}