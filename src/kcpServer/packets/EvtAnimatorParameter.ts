import Packet, { PacketContext, PacketInterface } from '#/packet'
import { EvtAnimatorParameterInfo } from '@/types/proto'
import { ForwardTypeEnum } from '@/types/proto/enum'

export interface EvtAnimatorParameterNotify {
  forwardType: ForwardTypeEnum
  animatorParamInfo: EvtAnimatorParameterInfo
}

class EvtAnimatorParameterPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAnimatorParameter')
  }

  async recvNotify(context: PacketContext, data: EvtAnimatorParameterNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: EvtAnimatorParameterNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtAnimatorParameterNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtAnimatorParameterPacket
export default (() => packet = packet || new EvtAnimatorParameterPacket())()