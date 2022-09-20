import Packet, { PacketContext, PacketInterface } from '#/packet'
import ClientGadget from '$/entity/gadget/clientGadget'
import { ClientStateEnum } from '@/types/enum'
import { VectorInfo } from '@/types/proto'
import { ForwardTypeEnum } from '@/types/proto/enum'

export interface EvtCreateGadgetNotify {
  forwardType: ForwardTypeEnum
  entityId: number
  configId: number
  campId: number
  campType: number
  initPos: VectorInfo
  initEulerAngles: VectorInfo
  guid: string
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
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtCreateGadgetNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer, currentScene } = player
    const { entityManager } = currentScene
    const { entityId } = data

    forwardBuffer.addEntry(this, data, seqId)
    await forwardBuffer.sendAll()

    // prevent duplicate
    if (entityManager.getEntity(entityId)) return

    const entity = new ClientGadget(player, data)
    await entity.initNew()

    // add entity to loaded entity list
    player.loadEntity(entity)

    // add entity to scene
    await entityManager.add(entity)
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