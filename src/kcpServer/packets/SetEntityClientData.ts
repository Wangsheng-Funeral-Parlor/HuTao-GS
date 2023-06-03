import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { EntityClientData } from "@/types/proto"

export interface SetEntityClientDataNotify {
  entityId: number
  entityClientData: EntityClientData
}

class SetEntityClientDataPacket extends Packet implements PacketInterface {
  constructor() {
    super("SetEntityClientData", {
      notifyWaitState: ClientStateEnum.ENTER_SCENE | ClientStateEnum.ENTER_SCENE_READY,
      notifyWaitStateMask: 0xf0ff,
      notifyWaitStatePass: true,
    })
  }

  async recvNotify(context: PacketContext, data: SetEntityClientDataNotify): Promise<void> {
    const { player } = context
    const { broadcastContextList } = player.currentScene

    for (const ctx of broadcastContextList) ctx.seqId = context.seqId

    await this.broadcastNotify(
      broadcastContextList.filter((ctx) => ctx.player !== player),
      data
    )
  }

  async sendNotify(context: PacketContext, data: SetEntityClientDataNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: SetEntityClientDataNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: SetEntityClientDataPacket
export default (() => (packet = packet || new SetEntityClientDataPacket()))()
