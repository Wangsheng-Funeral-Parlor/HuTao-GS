import Packet, { PacketInterface, PacketContext } from '#/packet'
import { StoreTypeEnum } from '@/types/enum/player'
import { ClientState } from '@/types/enum/state'
import { ItemInterface } from '@/types/game/item'

export interface PlayerStoreNotify {
  storeType: StoreTypeEnum
  itemList: ItemInterface[]
  weightLimit: number
}

class PlayerStorePacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerStore')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.LOGIN)) return

    const { inventory } = context.player

    const notifyData: PlayerStoreNotify = {
      storeType: StoreTypeEnum.STORE_PACK,
      itemList: inventory.exportItemList(),
      weightLimit: 30000
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerStorePacket
export default (() => packet = packet || new PlayerStorePacket())()