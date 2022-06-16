import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ForwardTypeEnum } from '@/types/enum/invoke'
import { ClientState } from '@/types/enum/state'
import { VectorInterface } from '@/types/game/motion'

export interface EvtAvatarUpdateFocusNotify {
  forwardType: ForwardTypeEnum
  entityId: number
  focusForward: VectorInterface
}

class EvtAvatarUpdateFocusPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAvatarUpdateFocus', {
      notifyState: ClientState.IN_GAME,
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