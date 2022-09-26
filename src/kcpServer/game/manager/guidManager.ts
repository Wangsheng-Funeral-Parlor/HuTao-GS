import Player from '$/player'
import TLogger from '@/translate/tlogger'
import GuidUserData from '@/types/user/GuidUserData'

const logger = new TLogger('GIDMGR', 0x7303fc)

export default class GuidManager {
  player: Player

  usedId: number[]
  remapId: { [old: string]: number }

  constructor(player: Player) {
    this.player = player
    this.usedId = []
    this.remapId = {}
  }

  static parseGuid(guid: bigint) {
    return {
      uid: Number(guid >> 32n),
      id: Number(guid & 0xFFFFFFFFn)
    }
  }

  init(userData: GuidUserData) {
    const { usedId } = this
    const {
      usedIdList
    } = userData || {}

    usedId.splice(0)
    usedId.push(...(usedIdList || []))
  }

  private getNextGuid(seed?: number): bigint {
    const { player, usedId } = this

    let i = 0
    let id = Math.abs((seed == null ? usedId[usedId.length - 1] : seed) || 0) % 0x100000000
    while (usedId.includes(id)) {
      if (i >= 0xFFFFFFFF) {
        logger.error('message.guid.error.full')
        break
      }
      i++

      id++
      id %= 0x100000000
    }

    usedId.push(id)

    return (BigInt(player?.uid || 0) << 32n) | BigInt(id)
  }

  isValidGuid(guid: bigint): boolean {
    if (guid == null) return false

    const { player, usedId, remapId } = this
    if (remapId[guid.toString()]) return true

    const { uid, id } = GuidManager.parseGuid(guid)
    return player.uid === uid && usedId.includes(id)
  }

  getGuid(guid?: bigint): bigint {
    if (guid == null) return this.getNextGuid()

    const { player, remapId } = this
    const guidStr = guid.toString()

    if (remapId[guidStr] != null) return (BigInt(player.uid) << 32n) | BigInt(remapId[guid.toString()])

    if (!this.isValidGuid(guid)) {
      const newGuid = this.getNextGuid(GuidManager.parseGuid(guid).id)
      if (newGuid.toString() !== guidStr) remapId[guidStr] = GuidManager.parseGuid(newGuid).id
      return newGuid
    }

    return guid
  }

  freeGuid(guid: bigint) {
    if (!this.isValidGuid(guid)) return

    const { usedId } = this
    const { id } = GuidManager.parseGuid(guid)

    usedId.splice(usedId.indexOf(id), 1)
  }

  cleanupUnused() {
    const { player, usedId } = this
    const { avatarList, inventory } = player
    const { itemList } = inventory

    const usedIdList = []

    // get used id from avatars
    for (const avatar of avatarList) {
      if (!this.isValidGuid(avatar?.guid)) continue
      usedIdList.push(GuidManager.parseGuid(avatar.guid).id)
    }

    // get used id from items
    for (const item of itemList) {
      if (!this.isValidGuid(item?.guid)) continue
      usedIdList.push(GuidManager.parseGuid(item.guid).id)
    }

    // find unused id
    const unusedIdList = []
    for (const id of usedId) {
      if (usedIdList.includes(id)) continue
      unusedIdList.push(id)
    }

    // cleanup
    for (const id of unusedIdList) usedId.splice(usedId.indexOf(id), 1)
  }

  exportUserData(): GuidUserData {
    const { usedId } = this
    this.cleanupUnused()

    return {
      usedIdList: usedId
    }
  }
}