import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ForwardTypeEnum } from '@/types/enum/invoke'
import { ClientState } from '@/types/enum/state'
import { VectorInterface } from '@/types/game/motion'

interface EvtCreateGadgetNotify {
  forwardType: ForwardTypeEnum
  entityId: number
  configId: number
  campId: number
  campType: number
  initPos: VectorInterface
  initEulerAngles: VectorInterface
  guid: number
  ownerEntityId: number
  targetEntityId: number
  isAsyncLoad: boolean
  targetLockPointIndex: number
  roomId: number
  propOwnerEntityId: number
  sightGroupWithOwner: boolean
}

class EvtCreateGadgetPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtCreateGadget', {
      notifyState: ClientState.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtCreateGadgetNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer/*, loadedEntityIdList, currentScene*/ } = player

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()

    if (!player.isInMp()) return

    // add to player entity list
    //loadedEntityIdList.push(data.entityId)

    // add entity to scene entity list
    //currentScene.entityManager.add()
  }

  async sendNotify(context: PacketContext, data: EvtCreateGadgetNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtCreateGadgetNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtCreateGadgetPacket
export default (() => packet = packet || new EvtCreateGadgetPacket())()