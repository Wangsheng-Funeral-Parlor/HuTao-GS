import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { ForwardTypeEnum } from '@/types/proto/enum'

interface EvtDestroyGadgetNotify {
  forwardType: ForwardTypeEnum
  entityId: number
}

class EvtDestroyGadgetPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtDestroyGadget', {
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtDestroyGadgetNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player

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