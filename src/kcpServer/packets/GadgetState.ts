import Packet, { PacketContext, PacketInterface } from '#/packet'
import Gadget from '$/entity/gadget'
import { GadgetStateEnum } from '@/types/enum'

export interface GadgetStateNotify {
  gadgetEntityId: number
  gadgetState: GadgetStateEnum
  isEnableInteract: boolean
}

class GadgetStatePacket extends Packet implements PacketInterface {
  constructor() {
    super('GadgetState')
  }

  async sendNotify(context: PacketContext, gadget: Gadget): Promise<void> {
    const { entityId, gadgetState, interactId } = gadget
    const notifyData: GadgetStateNotify = {
      gadgetEntityId: entityId,
      gadgetState,
      isEnableInteract: interactId != null
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], gadget: Gadget): Promise<void> {
    await super.broadcastNotify(contextList, gadget)
  }
}

let packet: GadgetStatePacket
export default (() => packet = packet || new GadgetStatePacket())()