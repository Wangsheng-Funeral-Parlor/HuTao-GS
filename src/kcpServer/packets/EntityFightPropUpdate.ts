import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'

export interface EntityFightPropUpdateNotify {
  entityId: number
  fightPropMap: { [type: number]: number }
}

class EntityFightPropUpdatePacket extends Packet implements PacketInterface {
  constructor() {
    super('EntityFightPropUpdate')
  }

  async sendNotify(context: PacketContext, data: EntityFightPropUpdateNotify): Promise<void> {
    await this.waitState(context, ClientState.IN_GAME, true)

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EntityFightPropUpdateNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EntityFightPropUpdatePacket
export default (() => packet = packet || new EntityFightPropUpdatePacket())()