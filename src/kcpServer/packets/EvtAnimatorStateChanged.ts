import Packet, { PacketContext, PacketInterface } from "#/packet"
import { EvtAnimatorStateChangedInfo } from "@/types/proto"
import { ForwardTypeEnum } from "@/types/proto/enum"

export interface EvtAnimatorStateChangedNotify {
  forwardType: ForwardTypeEnum
  animatorParamInfo: EvtAnimatorStateChangedInfo
}

class EvtAnimatorStateChangedPacket extends Packet implements PacketInterface {
  constructor() {
    super("EvtAnimatorStateChanged")
  }

  async recvNotify(context: PacketContext, data: EvtAnimatorStateChangedNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: EvtAnimatorStateChangedNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtAnimatorStateChangedNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtAnimatorStateChangedPacket
export default (() => (packet = packet || new EvtAnimatorStateChangedPacket()))()
