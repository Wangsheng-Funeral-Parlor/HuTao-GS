import Packet, { PacketInterface, PacketContext } from "#/packet"
import { VectorInfo } from "@/types/proto"
import { ItemHint } from "@/types/proto/ItemHint"

export interface ItemAddHintNotify {
  questId?: number
  overflowTransformedItemList?: ItemHint[]
  reason: number
  position?: VectorInfo
  itemList?: ItemHint[]
}

class ItemAddHintPacket extends Packet implements PacketInterface {
  constructor() {
    super("ItemAddHint")
  }
  async sendNotify(context: PacketContext, notifyData: ItemAddHintNotify): Promise<void> {
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], ...data: any[]): Promise<void> {
    await super.broadcastNotify(contextList, ...data)
  }
}

let packet: ItemAddHintPacket
export default (() => (packet = packet || new ItemAddHintPacket()))()
