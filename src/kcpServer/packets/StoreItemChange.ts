import Packet, { PacketInterface, PacketContext } from '#/packet'
import Item from '$/player/inventory/item'
import { StoreTypeEnum } from '@/types/enum/player'
import { ItemInterface } from '@/types/game/item'

export interface StoreItemChangeNotify {
  storeType: StoreTypeEnum
  itemList: ItemInterface[]
}

class StoreItemChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('StoreItemChange')
  }

  async sendNotify(context: PacketContext, itemList: Item[]): Promise<void> {
    const notifyData: StoreItemChangeNotify = {
      storeType: StoreTypeEnum.STORE_PACK,
      itemList: itemList.map(item => item.export())
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: StoreItemChangePacket
export default (() => packet = packet || new StoreItemChangePacket())()