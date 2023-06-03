import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { QuitReasonEnum } from "@/types/proto/enum"

export interface PlayerQuitFromMpNotify {
  reason: QuitReasonEnum
}

class PlayerQuitFromMpPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerQuitFromMp")
  }

  async sendNotify(context: PacketContext, reason: QuitReasonEnum): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.IN_GAME, true)) return

    const notifyData: PlayerQuitFromMpNotify = {
      reason,
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerQuitFromMpPacket
export default (() => (packet = packet || new PlayerQuitFromMpPacket()))()
