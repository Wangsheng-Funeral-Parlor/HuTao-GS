import Packet, { PacketContext, PacketInterface } from '#/packet'
import Entity from '$/entity'
import { AbilityControlBlock } from '@/types/proto'

export interface AbilityChangeNotify {
  entityId: number
  abilityControlBlock: AbilityControlBlock
}

class AbilityChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('AbilityChange')
  }

  async sendNotify(context: PacketContext, entity: Entity): Promise<void> {
    const { entityId, abilityManager } = entity

    const notifyData: AbilityChangeNotify = {
      entityId,
      abilityControlBlock: {
        abilityEmbryoList: abilityManager.exportEmbryoList()
      }
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], entity: Entity): Promise<void> {
    await super.broadcastNotify(contextList, entity)
  }
}

let packet: AbilityChangePacket
export default (() => packet = packet || new AbilityChangePacket())()