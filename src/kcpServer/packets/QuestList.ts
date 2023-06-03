import Packet, { PacketContext, PacketInterface } from "#/packet"
import { Quest } from "@/types/proto"

export interface QuestListNotify {
  questList: Quest[]
}

class QuestListPacket extends Packet implements PacketInterface {
  constructor() {
    super("QuestList")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: QuestListNotify = {
      questList: [],
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: QuestListPacket
export default (() => (packet = packet || new QuestListPacket()))()
