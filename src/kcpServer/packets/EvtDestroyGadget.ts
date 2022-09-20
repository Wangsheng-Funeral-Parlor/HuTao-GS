import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { ForwardTypeEnum } from '@/types/proto/enum'

export interface EvtDestroyGadgetNotify {
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
    const { forwardBuffer, currentScene } = player
    const { entityManager } = currentScene
    const { entityId } = data

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()

    const entity = entityManager.getEntity(entityId)
    if (entity == null) return

    // remove entity from loaded entity list
    player.unloadEntity(entity)

    // remove entity from scene
    await currentScene.entityManager.unregister(entity)
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