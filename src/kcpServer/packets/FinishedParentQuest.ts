import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ParentQuest } from "@/types/proto"
import { getJson } from "@/utils/json"

export interface FinishedParentQuestNotify {
  parentQuestList: ParentQuest[]
}

class FinishedParentQuestPacket extends Packet implements PacketInterface {
  constructor() {
    super("FinishedParentQuest")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: FinishedParentQuestNotify = {
      parentQuestList: getJson("data/parentQuestList.json", []),
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: FinishedParentQuestPacket
export default (() => (packet = packet || new FinishedParentQuestPacket()))()
