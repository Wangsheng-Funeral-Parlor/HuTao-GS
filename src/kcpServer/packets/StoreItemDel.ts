import Packet, { PacketInterface, PacketContext } from '#/packet'
import Item from '$/player/inventory/item'
import { StoreTypeEnum } from '@/types/enum/player'

export interface StoreItemDelNotify {
  storeType: StoreTypeEnum
  guidList: string[]
}

class StoreItemDelPacket extends Packet implements PacketInterface {
  constructor() {
    super('StoreItemDel')
  }

  async sendNotify(context: PacketContext, itemList: Item[]): Promise<void> {
    const notifyData: StoreItemDelNotify = {
      storeType: StoreTypeEnum.STORE_PACK,
      guidList: itemList.map(item => item.guid.toString())
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: StoreItemDelPacket
export default (() => packet = packet || new StoreItemDelPacket())()