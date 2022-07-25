import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { VectorInfo } from '@/types/proto'
import { ForwardTypeEnum } from '@/types/proto/enum'

export interface EvtAvatarExitFocusNotify {
  forwardType: ForwardTypeEnum
  entityId: number
  finishForward: VectorInfo
}

class EvtAvatarExitFocusPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAvatarExitFocus', {
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtAvatarExitFocusNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: EvtAvatarExitFocusNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtAvatarExitFocusNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtAvatarExitFocusPacket
export default (() => packet = packet || new EvtAvatarExitFocusPacket())()