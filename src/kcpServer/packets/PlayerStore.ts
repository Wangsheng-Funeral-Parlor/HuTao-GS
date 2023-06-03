import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { ItemInfo } from "@/types/proto"
import { StoreTypeEnum } from "@/types/proto/enum"

export interface PlayerStoreNotify {
  storeType: StoreTypeEnum
  itemList: ItemInfo[]
  weightLimit: number
}

class PlayerStorePacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerStore")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN)) return

    const { inventory } = context.player

    const notifyData: PlayerStoreNotify = {
      storeType: StoreTypeEnum.STORE_PACK,
      itemList: inventory.exportItemList(),
      weightLimit: 30000,
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerStorePacket
export default (() => (packet = packet || new PlayerStorePacket()))()
