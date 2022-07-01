import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ForwardTypeEnum } from '@/types/enum/invoke'
import { ClientState } from '@/types/enum/state'

interface EvtDestroyGadgetNotify {
  forwardType: ForwardTypeEnum
  entityId: number
}

class EvtDestroyGadgetPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtDestroyGadget', {
      notifyState: ClientState.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtDestroyGadgetNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer, currentScene } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()

    if (!player.isInMp()) return

    // remove entity from scene entity list
    //currentScene.entityManager.remove(data.entityId)
  }

  async sendNotify(context: PacketContext, data: EvtDestroyGadgetNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtDestroyGadgetNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtDestroyGadgetPacket
export default (() => packet = packet || new EvtDestroyGadgetPacket())()