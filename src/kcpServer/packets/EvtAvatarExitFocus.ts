import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ForwardTypeEnum } from '@/types/enum/invoke'
import { ClientState } from '@/types/enum/state'
import { VectorInterface } from '@/types/game/motion'

export interface EvtAvatarExitFocusNotify {
  forwardType: ForwardTypeEnum
  entityId: number
  finishForward: VectorInterface
}

class EvtAvatarExitFocusPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAvatarExitFocus', {
      notifyState: ClientState.IN_GAME,
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