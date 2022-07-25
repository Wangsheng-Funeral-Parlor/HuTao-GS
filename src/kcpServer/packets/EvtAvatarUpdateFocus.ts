import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { VectorInfo } from '@/types/proto'
import { ForwardTypeEnum } from '@/types/proto/enum'

export interface EvtAvatarUpdateFocusNotify {
  forwardType: ForwardTypeEnum
  entityId: number
  focusForward: VectorInfo
}

class EvtAvatarUpdateFocusPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAvatarUpdateFocus', {
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtAvatarUpdateFocusNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: EvtAvatarUpdateFocusNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtAvatarUpdateFocusNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtAvatarUpdateFocusPacket
export default (() => packet = packet || new EvtAvatarUpdateFocusPacket())()