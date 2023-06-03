import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"

export interface EvtAvatarStandUpNotify {
  entityId: number
  direction: number
  performID: number
  chairId: number
}

class EvtAvatarStandUpPacket extends Packet implements PacketInterface {
  constructor() {
    super("EvtAvatarStandUp", {
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true,
    })
  }

  async recvNotify(context: PacketContext, data: EvtAvatarStandUpNotify): Promise<void> {
    await this.broadcastNotify(context.player.currentScene.broadcastContextList, data)
  }

  async sendNotify(context: PacketContext, data: EvtAvatarStandUpNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtAvatarStandUpNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtAvatarStandUpPacket
export default (() => (packet = packet || new EvtAvatarStandUpPacket()))()
