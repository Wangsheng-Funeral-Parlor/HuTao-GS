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
    const { entityId } = entity

    const notifyData: AbilityChangeNotify = {
      entityId,
      abilityControlBlock: {
        abilityEmbryoList: entity.abilityList.exportEmbryoList()
      }
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: AbilityChangePacket
export default (() => packet = packet || new AbilityChangePacket())()