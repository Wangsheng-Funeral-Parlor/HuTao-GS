import Packet, { PacketInterface, PacketContext } from "#/packet"
import Gadget from "$/entity/gadget"

export interface WorktopOptionNotify {
  optionList: number[]
  gadgetEntityId: number
}
class WorktopOptionPacket extends Packet implements PacketInterface {
  constructor() {
    super("WorktopOption")
  }

  async sendNotify(context: PacketContext, gadget: Gadget): Promise<void> {
    const notifyData: WorktopOptionNotify = {
      optionList: gadget.worktopOption,
      gadgetEntityId: gadget.entityId,
    }
    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], gadget: Gadget): Promise<void> {
    await super.broadcastNotify(contextList, gadget)
  }
}

let packet: WorktopOptionPacket
export default (() => (packet = packet || new WorktopOptionPacket()))()
